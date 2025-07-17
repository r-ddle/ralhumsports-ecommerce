import './globals.css'

interface LoginLayoutProps {
  children: React.ReactNode
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return <div className="min-h-screen bg-brand-background">{children}</div>
}
