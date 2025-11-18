// Universal API proxy to bypass CORS
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_API_URL || "http://103.74.92.81:8000"

export async function GET(
	request: NextRequest,
	{ params }: { params: { path: string[] } }
) {
	return proxyRequest(request, params.path, "GET")
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { path: string[] } }
) {
	return proxyRequest(request, params.path, "POST")
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { path: string[] } }
) {
	return proxyRequest(request, params.path, "PUT")
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { path: string[] } }
) {
	return proxyRequest(request, params.path, "DELETE")
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { path: string[] } }
) {
	return proxyRequest(request, params.path, "PATCH")
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	})
}

async function proxyRequest(
	request: NextRequest,
	pathSegments: string[],
	method: string
) {
	try {
		const path = pathSegments.join("/")
		const backendUrl = `${BACKEND_URL}/${path}`
		
		// Build URL with query parameters
		const url = new URL(backendUrl)
		request.nextUrl.searchParams.forEach((value, key) => {
			url.searchParams.append(key, value)
		})

		const headers = new Headers()
		
		// Forward authorization header
		const authHeader = request.headers.get("authorization")
		if (authHeader) {
			headers.set("Authorization", authHeader)
		}
		
		headers.set("Content-Type", "application/json")

		const options: RequestInit = {
			method,
			headers,
		}

		// Add body for POST, PUT, PATCH
		if (["POST", "PUT", "PATCH"].includes(method)) {
			try {
				const body = await request.json()
				options.body = JSON.stringify(body)
			} catch (error) {
				// Try to get body as text if JSON parsing fails
				try {
					const text = await request.text()
					if (text) {
						options.body = text
					}
				} catch {
					// No body available
				}
			}
		}

		// Make request to backend
		const response = await fetch(url.toString(), options)
		
		// Handle response
		let data: any = {}
		const contentType = response.headers.get("content-type") || ""
		
		if (contentType.includes("application/json")) {
			try {
				const text = await response.text()
				if (text) {
					data = JSON.parse(text)
				}
			} catch (error) {
				// If JSON parsing fails, return error message
				data = { 
					error: "Invalid JSON response from backend",
					status: response.status,
					statusText: response.statusText
				}
			}
		} else {
			const text = await response.text().catch(() => "")
			if (text) {
				try {
					data = JSON.parse(text)
				} catch {
					data = { message: text || "Empty response" }
				}
			}
		}
		
		// Return response with CORS headers
		return NextResponse.json(data, {
			status: response.status,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		})
	} catch (error: any) {
		console.error("Proxy error:", error)
		return NextResponse.json(
			{ 
				error: error?.message || "Proxy error",
				details: process.env.NODE_ENV === "development" ? error?.stack : undefined
			},
			{ status: 500 }
		)
	}
}

