'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Skeleton } from './skeleton'

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  containerClassName?: string
  priority?: boolean
  onClick?: () => void
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  containerClassName = '',
  priority = false,
  onClick,
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' },
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoading(false)
    setError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError(true)
  }

  return (
    <div ref={imgRef} className={containerClassName} onClick={onClick}>
      {isInView && (
        <>
          {isLoading && (
            <Skeleton className="absolute inset-0 w-full h-full rounded-lg animate-pulse" />
          )}
          {error ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
              <div className="text-center text-gray-400">
                <div className="text-2xl mb-2">📷</div>
                <div className="text-xs">Image not found</div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                onLoad={handleLoad}
                onError={handleError}
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

// Optimized Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand badge */}
        <div className="h-4 w-16 bg-gray-200 rounded" />

        {/* Product name */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>

        {/* Category */}
        <div className="h-3 w-20 bg-gray-200 rounded" />

        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded" />
          ))}
        </div>

        {/* Price */}
        <div className="h-5 w-24 bg-gray-200 rounded" />

        {/* Stock badge */}
        <div className="h-4 w-16 bg-gray-200 rounded" />

        {/* Button */}
        <div className="h-8 w-full bg-gray-200 rounded" />
      </div>
    </div>
  )
}

// Optimized Product List Skeleton
export function ProductListSkeleton() {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg overflow-hidden animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6">
        {/* Image skeleton */}
        <div className="aspect-square sm:aspect-auto sm:h-32 bg-gray-200 rounded-xl" />

        {/* Content skeleton */}
        <div className="sm:col-span-3 space-y-3">
          {/* Brand */}
          <div className="h-4 w-16 bg-gray-200 rounded" />

          {/* Name */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-gray-200 rounded" />
            <div className="h-5 w-2/3 bg-gray-200 rounded" />
          </div>

          {/* Category */}
          <div className="h-3 w-20 bg-gray-200 rounded" />

          {/* Rating */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
            ))}
          </div>

          {/* Price and button */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-8 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Grid skeleton container
export function ProductGridSkeleton({ count = 24 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// List skeleton container
export function ProductListSkeletonContainer({ count = 12 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductListSkeleton key={i} />
      ))}
    </div>
  )
}
