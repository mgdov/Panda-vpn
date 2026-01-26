import type { InputHTMLAttributes } from 'react'
import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string
    icon?: string
    error?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, icon = '🔐', error, className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)

        return (
            <div>
                <label className="flex text-sm font-bold text-white mb-3 items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full px-4 py-3.5 text-sm bg-white/95 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 hover:border-green-500/30 backdrop-blur-sm shadow-lg pr-10 [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(17_24_39)] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(255_255_255_/_0.95)] ${error ? 'border-red-500/50' : ''
                            } ${className}`}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {error && (
                    <p className="text-xs text-red-400 mt-1.5">{error}</p>
                )}
            </div>
        )
    }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
