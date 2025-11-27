import { NextRequest, NextResponse } from 'next/server'

const envBase = process.env.NEXT_PUBLIC_API_URL?.trim()
const fallbackBase = "https://vpn-p.ru"
const rawBase = envBase && envBase.startsWith("http")
    ? envBase.replace(/\/$/, "")
    : fallbackBase
const API_BASE_URL = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`

if (process.env.NODE_ENV === 'development') {
    console.log('[Proxy] Base URL:', API_BASE_URL)
}

function buildUrl(pathSegments: string[]): string {
    const segments = [...pathSegments]
    if (segments[0] === "api") {
        segments.shift()
    }
    const normalizedPath = segments.join("/")
    return normalizedPath ? `${API_BASE_URL}/${normalizedPath}` : API_BASE_URL
}

async function parseJsonSafe(response: Response) {
    const text = await response.text()
    if (!text) return {}
    try {
        return JSON.parse(text)
    } catch {
        return { error: text }
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathArray } = await params
    const url = buildUrl(pathArray)
    if (process.env.NODE_ENV === 'development') {
        console.log('[Proxy]', 'GET', url)
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await parseJsonSafe(response)
        if (process.env.NODE_ENV === 'development') {
            console.log('[Proxy] Response', response.status, url)
        }
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch from API' },
            { status: 500 }
        )
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathArray } = await params
    const url = buildUrl(pathArray)
    const body = await request.json()
    if (process.env.NODE_ENV === 'development') {
        console.log('[Proxy]', 'POST', url)
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(request.headers.get('Authorization') ? {
                    'Authorization': request.headers.get('Authorization')!
                } : {}),
            },
            body: JSON.stringify(body),
        })

        const data = await parseJsonSafe(response)
        if (process.env.NODE_ENV === 'development') {
            console.log('[Proxy] Response', response.status, url)
        }
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch from API' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathArray } = await params
    const url = buildUrl(pathArray)
    const body = await request.json()
    if (process.env.NODE_ENV === 'development') {
        console.log('[Proxy]', 'PUT', url)
    }

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(request.headers.get('Authorization') ? {
                    'Authorization': request.headers.get('Authorization')!
                } : {}),
            },
            body: JSON.stringify(body),
        })

        const data = await parseJsonSafe(response)
        if (process.env.NODE_ENV === 'development') {
            console.log('[Proxy] Response', response.status, url)
        }
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch from API' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathArray } = await params
    const url = buildUrl(pathArray)
    if (process.env.NODE_ENV === 'development') {
        console.log('[Proxy]', 'DELETE', url)
    }

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(request.headers.get('Authorization') ? {
                    'Authorization': request.headers.get('Authorization')!
                } : {}),
            },
        })

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 })
        }

        const data = await parseJsonSafe(response)
        if (process.env.NODE_ENV === 'development') {
            console.log('[Proxy] Response', response.status, url)
        }
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch from API' },
            { status: 500 }
        )
    }
}
