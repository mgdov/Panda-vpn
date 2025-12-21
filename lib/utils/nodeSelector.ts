/**
 * Утилита для выбора оптимальной ноды на клиенте
 * Выполняет быстрые TCP/TLS пробы на топ-N кандидатах от сервера
 */

import { apiClient } from "../api/client"
import type { NodeTop, ClientMetricsRequest } from "../api/types"

export interface ProbeResult {
    node: NodeTop
    latency_ms: number | null
    success: boolean
    error?: string
}

/**
 * Быстрая TCP connect проба (только для Node.js окружения)
 * В браузере используем HTTP probe вместо TCP
 */
async function probeTcpConnect(host: string, port: number, timeout: number = 2000): Promise<number | null> {
    // В браузере TCP connect недоступен напрямую
    // Используем HTTP probe вместо этого
    if (typeof window !== "undefined") {
        return null
    }
    
    // Для Node.js можно использовать net.Socket
    // Но для простоты используем HTTP probe везде
    return null
}

/**
 * HTTP/HTTPS probe для браузера
 * 
 * ВАЖНО: HTTP probe должен идти на тот же IP/порт, что и VPN нода,
 * либо на health endpoint, привязанный к ноде.
 * 
 * Если HTTP probe идёт через CDN — он НЕ измеряет ноду!
 * 
 * Правильно:
 * - https://node-domain:8443/health (если есть health endpoint)
 * - https://node-domain:8443/ (пробуем корневой путь)
 * 
 * НЕ правильно:
 * - https://cdn.example.com/node (через CDN)
 */
async function probeHttpConnect(url: string, timeout: number = 2000): Promise<number | null> {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        
        const startTime = performance.now()
        
        // Пробуем HEAD запрос (быстрее чем GET)
        try {
            const response = await fetch(url, {
                method: "HEAD",
                signal: controller.signal,
                cache: "no-cache",
                // Важно: не использовать кэш браузера
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0"
                }
            })
            clearTimeout(timeoutId)
            
            if (response.ok || response.status === 404 || response.status === 405) {
                // 404/405 тоже считаем успехом (сервер ответил, значит доступен)
                return performance.now() - startTime
            }
        } catch (fetchError) {
            clearTimeout(timeoutId)
            // Если HEAD не поддерживается, пробуем GET
            try {
                const controller2 = new AbortController()
                const timeoutId2 = setTimeout(() => controller2.abort(), timeout)
                const startTime2 = performance.now()
                
                const response2 = await fetch(url, {
                    method: "GET",
                    signal: controller2.signal,
                    cache: "no-cache",
                    headers: {
                        "Cache-Control": "no-cache, no-store, must-revalidate"
                    }
                })
                clearTimeout(timeoutId2)
                
                if (response2.ok || response2.status === 404 || response2.status === 405) {
                    return performance.now() - startTime2
                }
            } catch (getError) {
                return null
            }
        }
        
        return null
    } catch (error) {
        return null
    }
}

/**
 * Выполняет быстрые пробы на топ-N нодах
 */
export async function probeNodes(
    nodes: NodeTop[],
    probeTimeout: number = 2000
): Promise<ProbeResult[]> {
    const results: ProbeResult[] = []
    
    // Выполняем пробы параллельно для всех нод
    const probePromises = nodes.map(async (node) => {
        const host = node.domain || node.ip
        const port = node.port || 443
        
        if (!host || !port) {
            return {
                node,
                latency_ms: null,
                success: false,
                error: "No host or port specified"
            }
        }
        
        // Пробуем TCP connect (для браузера используем обходной путь)
        // В реальном приложении можно использовать WebRTC DataChannel или другие методы
        let latency: number | null = null
        
        try {
            // Для браузера: используем HTTP/HTTPS probe
            // ВАЖНО: probe должен идти на тот же IP/порт, что и VPN нода
            // Если есть health endpoint - используем его, иначе пробуем корневой путь
            if (node.domain) {
                // Сначала пробуем health endpoint (если есть)
                const healthUrl = `https://${node.domain}:${port}/health`
                latency = await probeHttpConnect(healthUrl, probeTimeout)
                
                // Если health endpoint не сработал, пробуем корневой путь
                if (latency === null) {
                    const httpsUrl = `https://${node.domain}:${port}/`
                    latency = await probeHttpConnect(httpsUrl, probeTimeout)
                }
                
                // Если HTTPS не сработал, пробуем HTTP (для некоторых нод)
                if (latency === null) {
                    const httpUrl = `http://${node.domain}:${port}/`
                    latency = await probeHttpConnect(httpUrl, probeTimeout)
                }
            }
        } catch (error) {
            return {
                node,
                latency_ms: null,
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            }
        }
        
        return {
            node,
            latency_ms: latency,
            success: latency !== null,
            error: latency === null ? "Connection timeout or failed" : undefined
        }
    })
    
    const probeResults = await Promise.all(probePromises)
    results.push(...probeResults)
    
    return results
}

/**
 * Выбирает лучшую ноду из результатов проб
 */
export function selectBestNode(results: ProbeResult[]): ProbeResult | null {
    // Фильтруем только успешные пробы
    const successful = results.filter(r => r.success && r.latency_ms !== null)
    
    if (successful.length === 0) {
        return null
    }
    
    // Сортируем по латентности (меньше = лучше)
    successful.sort((a, b) => {
        const latencyA = a.latency_ms || Infinity
        const latencyB = b.latency_ms || Infinity
        return latencyA - latencyB
    })
    
    return successful[0]
}

/**
 * Полный процесс выбора ноды:
 * 1. Запрашивает топ-N нод у сервера
 * 2. Выполняет быстрые пробы на клиенте
 * 3. Выбирает лучшую
 * 4. Отправляет метрики обратно на сервер (опционально)
 */
export async function selectOptimalNode(
    n: number = 5,
    region?: string | null,
    sendMetrics: boolean = true
): Promise<NodeTop | null> {
    try {
        // 1. Запрашиваем топ-N нод
        const topNodes = await apiClient.getTopNodes(n, region)
        
        if (topNodes.length === 0) {
            console.warn("No nodes available from server")
            return null
        }
        
        // 2. Выполняем быстрые пробы
        const probeResults = await probeNodes(topNodes, 2000) // 2 секунды таймаут
        
        // 3. Выбираем лучшую
        const best = selectBestNode(probeResults)
        
        if (!best) {
            console.warn("No nodes passed client-side probe")
            // Fallback: возвращаем первую ноду из списка сервера
            return topNodes[0]
        }
        
        // 4. Отправляем метрики обратно (если включено)
        if (sendMetrics && best.latency_ms !== null) {
            try {
                await apiClient.submitClientMetrics({
                    node_id: best.node.node_id,
                    measured_latency_ms: best.latency_ms,
                    success: best.success,
                    error_message: best.error || null
                })
            } catch (error) {
                // Не критично, если не удалось отправить метрики
                console.debug("Failed to submit client metrics:", error)
            }
        }
        
        return best.node
    } catch (error) {
        console.error("Error selecting optimal node:", error)
        return null
    }
}
