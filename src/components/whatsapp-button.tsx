"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  message?: string
  className?: string
  size?: "sm" | "lg" | "default"
  variant?: "default" | "outline"
  children?: React.ReactNode
}

export default function WhatsAppButton({
  message = "Hello Ralhum Sports! I'm interested in your sports equipment. Please contact me.",
  className = "",
  size = "default",
  variant = "default",
  children,
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button onClick={handleWhatsAppClick} size={size} variant={variant} className={className} type="button">
      <MessageCircle className="w-4 h-4 mr-2" />
      {children || "WHATSAPP US"}
    </Button>
  )
}
