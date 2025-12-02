"use client"

import Link from "next/link"

interface PricingCardProps {
  name: string
  icon: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}

export default function PricingCard({
  name,
  icon,
  price,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden transition-all ${highlighted
        ? "border-2 border-accent bg-linear-to-br from-green-950/30 to-black transform md:scale-105 shadow-2xl shadow-green-900/40"
        : "border border-accent/30 bg-black/40 hover:border-accent/70 shadow-lg hover:shadow-green-900/20"
        }`}
    >
      {highlighted && (
        <div className="absolute top-0 right-0 bg-linear-to-r from-green-600 to-green-500 text-white px-3 py-1 text-xs md:text-sm font-semibold rounded-bl-lg shadow-lg">
          ⭐ Популярный
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Icon */}
        <div className="text-4xl md:text-5xl mb-4">{icon}</div>

        {/* Name & Description */}
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">{name}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">{description}</p>

        {/* Price */}
        <div className="mb-4 md:mb-6">
          <span className="text-3xl md:text-4xl font-bold text-accent">${price}</span>
          <span className="text-sm md:text-base text-muted-foreground ml-2">/мес</span>
        </div>

        {/* CTA Button */}
        <Link
          href="/auth/signup"
          className={`block text-center mb-6 md:mb-8 rounded-lg py-2.5 md:py-3 font-semibold transition text-sm md:text-base ${highlighted ? "btn-primary" : "btn-secondary"
            }`}
        >
          {highlighted ? "✨ Выбрать сейчас" : "Выбрать"}
        </Link>

        {/* Features */}
        <ul className="space-y-2 md:space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 md:gap-3">
              <span className="text-green-400 mt-0.5 shrink-0 text-base md:text-lg">✓</span>
              <span className="text-xs md:text-sm text-white">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
