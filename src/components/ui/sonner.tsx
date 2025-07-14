'use client'

import { Toaster as Sonner, toast, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            'group toast bg-brand-surface text-text-primary border border-brand-border shadow-lg rounded-xl p-4',
          description: 'text-text-secondary',
          actionButton:
            'bg-brand-primary text-white hover:bg-primary-600 rounded-lg px-3 py-1.5 text-sm font-medium',
          cancelButton:
            'bg-gray-100 text-text-primary hover:bg-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium',
          closeButton: 'bg-gray-100 hover:bg-gray-200 text-text-secondary rounded-lg',
          success: 'bg-green-50 text-green-800 border-green-200',
          error: 'bg-red-50 text-red-800 border-red-200',
          warning: 'bg-orange-50 text-orange-800 border-orange-200',
          info: 'bg-blue-50 text-blue-800 border-blue-200',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast, type ToasterProps }
