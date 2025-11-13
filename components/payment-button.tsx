"use client"

import { useState } from "react"

interface PaymentButtonProps {
  planName: string
  price: string
  description: string
}

export default function PaymentButton({ planName, price, description }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName,
          amount: Number.parseFloat(price),
          description,
        }),
      })

      if (response.ok) {
        // Redirect to YuKassa payment page
        // This will be configured after YuKassa integration
        console.log("Payment initiated")
      }
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handlePayment} disabled={isLoading} className="btn-primary w-full">
      {isLoading ? "Обработка..." : `Выбрать: ${price}₽`}
    </button>
  )
}
