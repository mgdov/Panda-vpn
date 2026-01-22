interface PasswordStrength {
    score: number
    label: string
    color: string
}

export function calculatePasswordStrength(pwd: string): PasswordStrength {
    let score = 0

    // Минимальная система: 3 уровня сложности
    if (pwd.length >= 6) score++
    if (pwd.length >= 8) score++
    if (pwd.length >= 10) score++

    if (score === 1) return { score, label: "Слабый", color: "from-red-500 to-red-600" }
    if (score === 2) return { score, label: "Средний", color: "from-yellow-500 to-yellow-600" }
    return { score, label: "Надежный", color: "from-green-500 to-emerald-600" }
}

interface PasswordStrengthIndicatorProps {
    password: string
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
    if (!password) return null

    const strength = calculatePasswordStrength(password)

    return (
        <div className="mt-3 space-y-2">
            <div className="flex gap-1.5">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-linear-to-r ${strength.color} transition-all duration-300`}
                            style={{ width: strength.score > i ? "100%" : "0%" }}
                        />
                    </div>
                ))}
            </div>
            <p className={`text-xs font-bold text-transparent bg-linear-to-r ${strength.color} bg-clip-text`}>
                Надежность: {strength.label}
            </p>
        </div>
    )
}
