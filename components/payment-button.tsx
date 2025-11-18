"use client"

import { useState } from "react"
import { createPayment } from "@/lib/api"

interface PaymentButtonProps {
  tariffCode: string
  label?: string
}

export default function PaymentButton({ tariffCode, label }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const returnUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : ""
      const res = await createPayment(tariffCode, "yookassa", returnUrl)
      if (res.payment_url) {
        window.location.href = res.payment_url
      } else {
        setError("Не удалось получить ссылку на оплату")
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.payload?.message || err?.payload?.error || "Ошибка при создании платежа"
      setError(errorMessage)
      console.error("Payment error:", err)
      // Show alert for user-friendly error message
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-2 p-2 bg-red-900/20 border border-red-500/50 rounded text-xs text-red-400">
          {error}
        </div>
      )}
      <button onClick={handlePayment} disabled={isLoading} className="btn-primary w-full">
        {isLoading ? "Обработка..." : (label || "Оплатить")}
      </button>
    </div>
  )
}
