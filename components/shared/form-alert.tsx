import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface FormAlertProps {
    type: 'error' | 'success' | 'info'
    message: string
}

const alertConfig = {
    error: {
        icon: AlertCircle,
        gradient: 'from-red-500/20 to-red-600/20',
        border: 'border-red-500/50',
        textColor: 'text-red-200',
        iconColor: 'text-red-400',
    },
    success: {
        icon: CheckCircle2,
        gradient: 'from-green-500/20 to-emerald-600/20',
        border: 'border-green-500/50',
        textColor: 'text-green-200',
        iconColor: 'text-green-400',
    },
    info: {
        icon: Info,
        gradient: 'from-blue-500/20 to-cyan-600/20',
        border: 'border-blue-500/50',
        textColor: 'text-blue-200',
        iconColor: 'text-blue-400',
    },
}

export default function FormAlert({ type, message }: FormAlertProps) {
    const config = alertConfig[type]
    const Icon = config.icon

    return (
        <div className={`p-3.5 bg-linear-to-r ${config.gradient} border ${config.border} rounded-xl flex items-start gap-3 animate-pulse`}>
            <Icon size={18} className={`${config.iconColor} shrink-0 mt-0.5`} />
            <p className={`text-xs ${config.textColor}`}>{message}</p>
        </div>
    )
}
