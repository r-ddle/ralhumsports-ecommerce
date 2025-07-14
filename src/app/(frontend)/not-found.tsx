import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="text-center">
        <h1
          className="text-4xl sm:text-6xl font-bold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          404
        </h1>
        <p className="text-lg sm:text-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
          Oops! The page you are looking for does not exist.
        </p>
        <Link href="/" className="hover:underline" style={{ color: 'var(--primary-orange)' }}>
          Go back to Home
        </Link>
      </div>
    </div>
  )
}
