'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertCircle, Info } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToasterContextType {
  toast: (type: Toast['type'], message: string) => void
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined)

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return <Check size={18} />
      case 'error': return <AlertCircle size={18} />
      case 'info': return <Info size={18} />
    }
  }

  const getStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 border-green-500/30 text-green-400'
      case 'error': return 'bg-red-500/20 border-red-500/30 text-red-400'
      case 'info': return 'bg-blue-500/20 border-blue-500/30 text-blue-400'
    }
  }

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl ${getStyles(toast.type)}`}
            >
              {getIcon(toast.type)}
              <span className="text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

export function useToast() {
  const context = useContext(ToasterContext)
  if (!context) {
    // Fallback si no hay provider
    return {
      toast: (type: Toast['type'], message: string) => {
        console.log(`[${type}] ${message}`)
      }
    }
  }
  return context
}