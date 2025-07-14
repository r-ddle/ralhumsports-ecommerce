'use client'

import { useState, useRef, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface LazyImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  fallback?: string
  className?: string
  skeletonClassName?: string
  containerClassName?: string
}

export function LazyImage({
  src,
  alt,
  fallback = '/placeholder.svg',
  className,
  skeletonClassName,
  containerClassName,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoading(false)
    setIsError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setIsError(true)
  }

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', containerClassName)}>
      {/* Skeleton Loading State */}
      {isLoading && (
        <div
          className={cn('absolute inset-0 animate-pulse rounded-lg', skeletonClassName)}
          style={{ background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)' }}
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <Image
          src={isError ? fallback : src}
          alt={alt}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className,
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  )
}

// Product Card Skeleton
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl border shadow-lg p-4 space-y-4', className)}
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-gray)' }}
    >
      {/* Image skeleton */}
      <div
        className="aspect-square rounded-lg"
        style={{ background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)' }}
      />

      {/* Content skeleton */}
      <div className="space-y-2">
        <div
          className="h-4 rounded"
          style={{
            background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
            width: '60%',
          }}
        />
        <div
          className="h-6 rounded"
          style={{
            background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
            width: '80%',
          }}
        />
        <div
          className="h-4 rounded"
          style={{
            background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
            width: '40%',
          }}
        />
      </div>

      {/* Price skeleton */}
      <div
        className="h-6 rounded"
        style={{
          background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
          width: '50%',
        }}
      />
    </div>
  )
}

// List View Skeleton
export function ProductListSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl border shadow-lg p-4', className)}
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-gray)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Image skeleton */}
        <div
          className="aspect-square sm:aspect-auto sm:h-32 md:h-40 rounded-lg"
          style={{ background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)' }}
        />

        {/* Content skeleton */}
        <div className="sm:col-span-2 space-y-3">
          <div
            className="h-4 rounded"
            style={{
              background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
              width: '30%',
            }}
          />
          <div
            className="h-6 rounded"
            style={{
              background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
              width: '90%',
            }}
          />
          <div
            className="h-4 rounded"
            style={{
              background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
              width: '40%',
            }}
          />
          <div
            className="h-6 rounded"
            style={{
              background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
              width: '60%',
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Page Loading Skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8 space-y-4">
          <div
            className="h-8 rounded-lg"
            style={{
              background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
              width: '40%',
            }}
          />
          <div
            className="h-4 rounded"
            style={{
              background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
              width: '60%',
            }}
          />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
