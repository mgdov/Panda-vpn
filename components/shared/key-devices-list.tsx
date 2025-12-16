"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api/client"
import type { DeviceInfo } from "@/lib/api/types"

interface KeyDevicesListProps {
    clientId: string
    onDeviceRemoved?: () => void
}

export default function KeyDevicesList({ clientId, onDeviceRemoved }: KeyDevicesListProps) {
    const [devices, setDevices] = useState<DeviceInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadDevices()
    }, [clientId])

    const loadDevices = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await apiClient.getDevices(clientId)
            setDevices(data.devices.filter(d => d.is_active))
        } catch (err: any) {
            console.error("Failed to load devices:", err)
            setError("Не удалось загрузить список устройств")
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveDevice = async (deviceId: string) => {
        if (!confirm("Вы уверены, что хотите отключить это устройство?")) {
            return
        }

        try {
            await apiClient.removeDevice(deviceId)
            await loadDevices()
            if (onDeviceRemoved) {
                onDeviceRemoved()
            }
        } catch (err) {
            console.error("Failed to remove device:", err)
            alert("Не удалось отключить устройство. Попробуйте еще раз.")
        }
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateString
        }
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    if (loading) {
        return (
            <div className="mt-3 p-3 bg-black/40 rounded-lg">
                <p className="text-xs text-gray-400">Загрузка устройств...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400">{error}</p>
            </div>
        )
    }

    if (devices.length === 0) {
        return (
            <div className="mt-3 p-3 bg-black/40 rounded-lg">
                <p className="text-xs text-gray-400">Нет активных устройств</p>
            </div>
        )
    }

    return (
        <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold text-gray-400 mb-2">Активные устройства:</p>
            {devices.map((device) => (
                <div
                    key={device.id}
                    className="p-3 bg-black/40 border border-gray-700/50 rounded-lg flex items-center justify-between"
                >
                    <div className="flex-1">
                        <p className="text-xs font-medium text-white">
                            {device.device_name || 'Неизвестное устройство'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Последняя активность: {formatDate(device.last_activity_at)}
                        </p>
                        {(device.bytes_sent > 0 || device.bytes_received > 0) && (
                            <p className="text-xs text-gray-500 mt-1">
                                Трафик: {formatBytes(device.bytes_sent + device.bytes_received)}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => handleRemoveDevice(device.id)}
                        className="ml-3 px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        Отключить
                    </button>
                </div>
            ))}
        </div>
    )
}
