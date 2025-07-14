export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-background">
      <div className="text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-text-primary mb-4">404</h1>
        <p className="text-lg sm:text-xl text-text-secondary mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <a href="/" className="text-brand-primary hover:underline">
          Go back to Home
        </a>
      </div>
    </div>
  )
}
