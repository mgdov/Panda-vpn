"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api/client"
import { getErrorMessage } from "@/lib/api/errors"

interface PaymentButtonProps {
  planName?: string
  price: string
  description?: string
  tariffId: string // ID тарифа для оплаты
}

export default function PaymentButton({ price, tariffId }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePayment = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await apiClient.createPayment({
        tariff_id: tariffId,
        return_url: `${window.location.origin}/dashboard?tab=keys&payment=success`
      })

      // Редирект на страницу оплаты YooKassa
      if (result.confirmation_url || result.payment_url) {
        window.location.href = result.confirmation_url || result.payment_url || ""
      } else {
        setError("Не удалось получить ссылку на оплату")
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      console.error("Payment error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-2 text-sm text-red-400">{error}</div>
      )}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? "Обработка..." : `Выбрать: ${price}₽`}
      </button>
    </div>
  )
}
