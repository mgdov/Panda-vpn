import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://vpn-p.ru'}/api`

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathArray } = await params
    const path = pathArray.join('/')
    const url = `${API_BASE_URL}/${path}`

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
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
    const path = pathArray.join('/')
    const url = `${API_BASE_URL}/${path}`
    const body = await request.json()

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

        const data = await response.json()
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
    const path = pathArray.join('/')
    const url = `${API_BASE_URL}/${path}`
    const body = await request.json()

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

        const data = await response.json()
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
    const path = pathArray.join('/')
    const url = `${API_BASE_URL}/${path}`

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

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch from API' },
            { status: 500 }
        )
    }
}
