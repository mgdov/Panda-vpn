import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    icon?: string
    error?: string
    showCheck?: boolean
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, icon, error, showCheck, className = '', ...props }, ref) => {
        return (
            <div>
                <label className="flex text-sm font-bold text-white mb-3 items-center gap-2">
                    {icon && <span className="text-lg">{icon}</span>}
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        className={`w-full px-4 py-3.5 text-sm bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 hover:border-white/30 hover:bg-white/10 backdrop-blur-sm shadow-lg ${error ? 'border-red-500/50' : ''
                            } ${className}`}
                        {...props}
                    />
                    {showCheck && props.value && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                            ✓
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-red-400 mt-1.5">{error}</p>
                )}
            </div>
        )
    }
)

FormInput.displayName = 'FormInput'

export default FormInput
