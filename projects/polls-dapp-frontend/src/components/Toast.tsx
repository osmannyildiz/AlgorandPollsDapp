import { AlertCircle, X } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

function Toast({ message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="backdrop-blur-md bg-red-500/90 border border-red-400 rounded-xl shadow-2xl p-4 flex items-start gap-3 min-w-[320px] max-w-md">
        <AlertCircle className="text-white flex-shrink-0 mt-0.5" size={20} />
        <p className="text-white font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default Toast
