'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, ChevronRight } from 'lucide-react'
import { CartButton } from '@/components/cart/cart-button'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Navigation() {
  // Compute dynamic shop link based on hover state
  // Helper to get slug for category, sport, item
  const getCategorySlug = (categoryName: string) => {
    return SITE_CONFIG.SPORTS_CATEGORIES[categoryName]?.slug || categoryName
  }
  const getSportSlug = (categoryName: string, sportName: string) => {
    return SITE_CONFIG.SPORTS_CATEGORIES[categoryName]?.sports[sportName]?.slug || sportName
  }
  const getItemSlug = (categoryName: string, sportName: string, itemName: string) => {
    return SITE_CONFIG.SPORTS_CATEGORIES[categoryName]?.sports[sportName]?.items[itemName]?.slug || itemName
  }

  const getShopLink = () => {
    if (hoveredCategory && hoveredSport && hoveredItem) {
      return `/products?category=${getCategorySlug(hoveredCategory)}&sport=${getSportSlug(hoveredCategory, hoveredSport)}&item=${getItemSlug(hoveredCategory, hoveredSport, hoveredItem)}`
    }
    if (hoveredCategory && hoveredSport) {
      return `/products?category=${getCategorySlug(hoveredCategory)}&sport=${getSportSlug(hoveredCategory, hoveredSport)}`
    }
    if (hoveredCategory) {
      return `/products?category=${getCategorySlug(hoveredCategory)}`
    }
    return '/products'
  }
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [hoveredSport, setHoveredSport] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [squircle, setSquircle] = useState({ left: 0, top: 0, width: 0, height: 0, visible: false })
  const [isMobile, setIsMobile] = useState(false)
  const [squircleAnimated, setSquircleAnimated] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const lastSquircle = useRef({ left: 0, top: 0, width: 0, height: 0 })

  // Organize sports hierarchy with 4 levels: Category > Sport > Items > Brands
  type BrandItem = {
    brands: string[]
    link: string
  }
  type SportItems = {
    [itemName: string]: BrandItem
  }
  type Sport = {
    icon: string
    description: string
    items: SportItems
  }
  type Sports = {
    [sportName: string]: Sport
  }
  type Category = {
    icon: string
    description: string
    sports: Sports
  }
  type SportsHierarchy = {
    [categoryName: string]: Category
  }

  const sportsHierarchy: SportsHierarchy = {
    'Ball Sports': {
      icon: '⚽',
      description: 'Equipment for ball-based sports',
      sports: {
        Cricket: {
          icon: '🏏',
          description: 'Professional cricket equipment',
          items: {
            'Cricket Bats': {
              brands: ['Gray-Nicolls', 'Leverage'],
              link: '/products?categories=cricket',
            },
            'Protective Gear': {
              brands: ['Gray-Nicolls', 'Aero'],
              link: '/products?categories=cricket',
            },
            'Cricket Balls': {
              brands: ['Gray-Nicolls'],
              link: '/products?categories=cricket',
            },
            'Bowling Machines': {
              brands: ['Leverage'],
              link: '/products?categories=cricket',
            },
            Accessories: {
              brands: ['Gray-Nicolls', 'Aero'],
              link: '/products?categories=cricket',
            },
          },
        },
        Rugby: {
          icon: '🏉',
          description: 'Professional rugby equipment',
          items: {
            'Rugby Balls': {
              brands: ['Gilbert'],
              link: '/products?categories=rugby',
            },
            'Training Equipment': {
              brands: ['Gilbert'],
              link: '/products?categories=rugby',
            },
            'Protective Gear': {
              brands: ['Gilbert'],
              link: '/products?categories=rugby',
            },
            'Team Accessories': {
              brands: ['Gilbert'],
              link: '/products?categories=rugby',
            },
          },
        },
        Basketball: {
          icon: '🏀',
          description: 'Professional basketball equipment',
          items: {
            Basketballs: {
              brands: ['Molten'],
              link: '/products?categories=basketball',
            },
            'Training Equipment': {
              brands: ['Molten'],
              link: '/products?categories=basketball',
            },
            'Court Accessories': {
              brands: ['Molten'],
              link: '/products?categories=basketball',
            },
          },
        },
        Volleyball: {
          icon: '🏐',
          description: 'Professional volleyball equipment',
          items: {
            Volleyballs: {
              brands: ['Molten'],
              link: '/products?categories=volleyball',
            },
            'Training Equipment': {
              brands: ['Molten'],
              link: '/products?categories=volleyball',
            },
            'Court Accessories': {
              brands: ['Molten'],
              link: '/products?categories=volleyball',
            },
          },
        },
      },
    },
    'Racquet Sports': {
      icon: '🎾',
      description: 'Professional racquet equipment',
      sports: {
        Tennis: {
          icon: '🎾',
          description: 'Professional tennis equipment',
          items: {
            'Tennis Rackets': {
              brands: ['Babolat'],
              link: '/products?categories=tennis',
            },
            'Tennis Strings': {
              brands: ['Ashaway', 'Babolat'],
              link: '/products?categories=tennis',
            },
            'Court Equipment': {
              brands: ['Babolat'],
              link: '/products?categories=tennis',
            },
            Accessories: {
              brands: ['Babolat', 'Ashaway'],
              link: '/products?categories=tennis',
            },
          },
        },
        Badminton: {
          icon: '🏸',
          description: 'Professional badminton equipment',
          items: {
            'Badminton Rackets': {
              brands: ['Babolat'],
              link: '/products?categories=badminton',
            },
            'Badminton Strings': {
              brands: ['Ashaway'],
              link: '/products?categories=badminton',
            },
            'String Accessories': {
              brands: ['Ashaway'],
              link: '/products?categories=badminton',
            },
          },
        },
        Squash: {
          icon: '🎯',
          description: 'Professional squash equipment',
          items: {
            'Squash Strings': {
              brands: ['Ashaway'],
              link: '/products?categories=squash',
            },
            'String Accessories': {
              brands: ['Ashaway'],
              link: '/products?categories=squash',
            },
          },
        },
      },
    },
    'Field Sports': {
      icon: '🏑',
      description: 'Field and outdoor sports gear',
      sports: {
        Hockey: {
          icon: '🏑',
          description: 'Professional hockey equipment',
          items: {
            'Hockey Sticks': {
              brands: ['Grays'],
              link: '/products?categories=hockey',
            },
            'Protective Equipment': {
              brands: ['Grays'],
              link: '/products?categories=hockey',
            },
            'Hockey Balls': {
              brands: ['Grays'],
              link: '/products?categories=hockey',
            },
            'Training Gear': {
              brands: ['Grays'],
              link: '/products?categories=hockey',
            },
          },
        },
        Football: {
          icon: '⚽',
          description: 'Football training equipment',
          items: {
            'Pop-Up Goals': {
              brands: ['Pugg'],
              link: '/products?categories=football',
            },
            'Training Sets': {
              brands: ['Pugg'],
              link: '/products?categories=football',
            },
            'Replacement Parts': {
              brands: ['Pugg'],
              link: '/products?categories=football',
            },
          },
        },
      },
    },
    'Training & Fitness': {
      icon: '🏋️',
      description: 'Multi-sport training equipment',
      sports: {
        'Multi-Sport Training': {
          icon: '🔄',
          description: 'Comprehensive training solutions',
          items: {
            'Training Equipment': {
              brands: ['Fusion'],
              link: '/products?categories=training',
            },
            'Agility Tools': {
              brands: ['Fusion'],
              link: '/products?categories=training',
            },
            'Strength Training': {
              brands: ['Fusion'],
              link: '/products?categories=training',
            },
            'Team Accessories': {
              brands: ['Fusion'],
              link: '/products?categories=training',
            },
          },
        },
      },
    },
  }

  const navItems = [
    { name: 'Brands', href: '/brands' },
    { name: 'Shop', href: '/products', hasDropdown: true },
    { name: 'About', href: '/about' },
    { name: 'Track', href: '/orders/track' },
    { name: 'Verify', href: '/products/verify' },
  ]

  const navRefs = React.useRef<React.RefObject<HTMLAnchorElement>[]>([])
  if (navRefs.current.length !== navItems.length) {
    navRefs.current = Array.from({ length: navItems.length }, () =>
      React.createRef<HTMLAnchorElement>(),
    ) as React.RefObject<HTMLAnchorElement>[]
  }

  // Get brand info from SITE_CONFIG
  const getBrandInfo = (brandName: string) => {
    return SITE_CONFIG.brands.find((brand) => brand.name === brandName)
  }

  // Detect mobile and reduced motion
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    setReducedMotion(mediaQuery.matches)
    checkMobile()

    const handleMotionChange = () => setReducedMotion(mediaQuery.matches)

    window.addEventListener('resize', checkMobile)
    mediaQuery.addEventListener('change', handleMotionChange)

    return () => {
      window.removeEventListener('resize', checkMobile)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // Update squircle position/size on hover (desktop only)
  useEffect(() => {
    if (isMobile || reducedMotion) {
      setSquircle((s) => ({ ...s, visible: false }))
      return
    }
    if (hoveredIdx !== null && navRefs.current[hoveredIdx]?.current) {
      const rect = navRefs.current[hoveredIdx]!.current!.getBoundingClientRect()
      const parentRect =
        navRefs.current[hoveredIdx]!.current!.parentElement!.parentElement!.getBoundingClientRect()
      const newSquircle = {
        left: rect.left - parentRect.left,
        top: rect.top - parentRect.top,
        width: rect.width,
        height: rect.height,
        visible: true,
      }
      setSquircle((prev) => {
        if (!prev.visible) {
          lastSquircle.current = newSquircle
          if (!squircleAnimated) setSquircleAnimated(true)
          return newSquircle
        }
        lastSquircle.current = newSquircle
        return newSquircle
      })
    } else {
      setSquircle((s) => ({ ...s, visible: false }))
    }
  }, [hoveredIdx, isMobile, reducedMotion])

  return (
    <>
      {/* Main Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-[95%] sm:w-[90%] max-w-[1000px] rounded-2xl sm:rounded-3xl mt-2 sm:mt-3 mx-auto border border-brand-border bg-brand-surface/90 backdrop-blur-lg shadow-xl transition-all duration-300"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-black tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-lg"
                style={{ color: SITE_CONFIG.branding.colors.primary }}
                aria-label="Ralhum Sports - Home"
              >
                <Image
                  width={80}
                  height={80}
                  src={SITE_CONFIG.branding.logoImage || '/placeholder.svg'}
                  alt={SITE_CONFIG.branding.logoText}
                  className="h-16 sm:h-20 lg:h-24 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div
              className="hidden md:flex items-center space-x-1 relative"
              style={{ minHeight: 48 }}
            >
              {navItems.map((item, index) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        setMegaMenuOpen(true)
                        setHoveredIdx(null) // Clear squircle for dropdown
                      }}
                      onMouseLeave={() => {
                        setMegaMenuOpen(false)
                        setHoveredCategory(null)
                        setHoveredSport(null)
                        setHoveredItem(null)
                        setHoveredIdx(null)
                      }}
                    >
                      <Link
                        href={getShopLink()}
                        className={`relative px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold rounded-xl transition-all duration-150 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 flex items-center gap-1
                          ${megaMenuOpen ? 'text-white bg-brand-primary font-bold' : 'text-text-primary hover:text-brand-primary hover:bg-brand-background'}`}
                        aria-label="Shop filtered products"
                      >
                        {item.name}
                        <ChevronRight
                          className={`w-3 h-3 transition-transform duration-200 ${megaMenuOpen ? 'rotate-90' : ''}`}
                        />
                      </Link>

                      {/* Mega Menu - Fixed Centering */}
                      <AnimatePresence>
                        {megaMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full mt-4 bg-brand-surface border border-brand-border shadow-2xl rounded-2xl overflow-hidden z-50"
                            style={{
                              width: '1000px',
                              maxWidth: '95vw',
                              left: 'calc(-500px + 210%)',
                            }}
                          >
                            <div className="flex h-fit">
                              {/* Level 1: Sports Categories - Fixed left rounding */}
                              <div className="w-56 bg-gray-50 border-r border-brand-border p-4 rounded-l-2xl">
                                <h3 className="text-lg font-bold text-text-primary mb-4 px-2">
                                  Sports Categories
                                </h3>
                                <div className="space-y-1">
                                  {Object.entries(sportsHierarchy).map(
                                    ([categoryName, category]) => (
                                      <div
                                        key={categoryName}
                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                          hoveredCategory === categoryName
                                            ? 'bg-brand-primary text-white shadow-lg'
                                            : 'hover:bg-white hover:shadow-md'
                                        }`}
                                        onMouseEnter={() => {
                                          setHoveredCategory(categoryName)
                                          setHoveredSport(null)
                                          setHoveredItem(null)
                                        }}
                                        onClick={() => {
                                          window.location.href = `/products?category=${encodeURIComponent(categoryName)}`
                                        }}
                                      >
                                        <div className="flex items-center gap-3">
                                          <span className="text-lg">{category.icon}</span>
                                          <div>
                                            <div className="font-semibold text-sm">
                                              {categoryName}
                                            </div>
                                            <span
                                              className={`text-xs ${hoveredCategory === categoryName ? 'text-gray-200' : 'text-text-secondary'}`}
                                            >
                                              {category.description}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>

                              {/* Level 2: Sports */}
                              {hoveredCategory && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="w-56 p-4 border-r border-brand-border"
                                >
                                  <h4 className="text-lg font-bold text-text-primary mb-4">
                                    Sports
                                  </h4>
                                  <div className="space-y-2">
                                    {Object.entries(sportsHierarchy[hoveredCategory].sports).map(
                                      ([sportName, sport]) => (
                                        <div
                                          key={sportName}
                                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                            hoveredSport === sportName
                                              ? 'bg-brand-primary text-white shadow-lg'
                                              : 'hover:bg-brand-background'
                                          }`}
                                          onMouseEnter={() => {
                                            setHoveredSport(sportName)
                                            setHoveredItem(null)
                                          }}
                                          onClick={() => {
                                            window.location.href = `/products?category=${encodeURIComponent(hoveredCategory)}&sport=${encodeURIComponent(sportName)}`
                                          }}
                                        >
                                          <div className="flex items-center gap-3">
                                            <span className="text-lg">{sport.icon}</span>
                                            <div>
                                              <div className="font-semibold text-sm">
                                                {sportName}
                                              </div>
                                              <div
                                                className={`text-xs ${hoveredSport === sportName ? 'text-gray-200' : 'text-text-secondary'}`}
                                              >
                                                {Object.keys(sport.items).length} items
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </motion.div>
                              )}

                              {/* Level 3: Sports Items */}
                              {hoveredCategory && hoveredSport && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="w-56 p-4 border-r border-brand-border"
                                >
                                  <h4 className="text-lg font-bold text-text-primary mb-4">
                                    {hoveredSport} Items
                                  </h4>
                                  <div className="space-y-2">
                                    {Object.entries(
                                      sportsHierarchy[hoveredCategory].sports[hoveredSport].items,
                                    ).map(([itemName, item]) => (
                                      <div
                                        key={itemName}
                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                          hoveredItem === itemName
                                            ? 'bg-brand-primary text-white shadow-lg'
                                            : 'hover:bg-brand-background'
                                        }`}
                                        onMouseEnter={() => setHoveredItem(itemName)}
                                        onClick={() => {
                                          window.location.href = `/products?category=${encodeURIComponent(hoveredCategory)}&sport=${encodeURIComponent(hoveredSport)}&item=${encodeURIComponent(itemName)}`
                                        }}
                                      >
                                        <div className="font-semibold text-sm mb-1">{itemName}</div>
                                        <div
                                          className={`text-xs ${hoveredItem === itemName ? 'text-gray-200' : 'text-text-secondary'}`}
                                        >
                                          {item.brands.length} brands
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}

                              {/* Level 4: Brands - Now with images */}
                              {hoveredCategory && hoveredSport && hoveredItem && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex-1 p-4"
                                >
                                  <h4 className="text-lg font-bold text-text-primary mb-4">
                                    {hoveredItem} Brands
                                  </h4>
                                  <div className="space-y-3">
                                    {sportsHierarchy[hoveredCategory].sports[hoveredSport].items[
                                      hoveredItem
                                    ].brands.map((brandName) => {
                                      const brandInfo = getBrandInfo(brandName)
                                      return (
                                        <Link
                                          key={brandName}
                                          href={`/products?brand=${brandInfo?.slug || brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                          className="block p-3 rounded-lg hover:bg-brand-background transition-colors group"
                                        >
                                          <div className="flex items-center gap-3">
                                            {brandInfo?.image && (
                                              <div className="w-8 h-8 flex-shrink-0">
                                                <Image
                                                  src={brandInfo.image}
                                                  alt={brandName}
                                                  width={32}
                                                  height={32}
                                                  className="w-full h-full object-contain"
                                                />
                                              </div>
                                            )}
                                            <div className="flex-1">
                                              <div className="font-semibold text-sm text-text-primary group-hover:text-brand-primary">
                                                {brandName}
                                              </div>
                                              {brandInfo && (
                                                <div className="text-xs text-text-secondary mt-1">
                                                  {brandInfo.tagline}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </Link>
                                      )
                                    })}
                                  </div>

                                  {/* CTA Section */}
                                  <div className="mt-6 pt-4 border-t border-brand-border">
                                    <Link
                                      href={
                                        sportsHierarchy[hoveredCategory].sports[hoveredSport].items[
                                          hoveredItem
                                        ].link
                                      }
                                      className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                                    >
                                      Shop All {hoveredItem}
                                      <ChevronRight className="w-4 h-4 ml-2" />
                                    </Link>
                                  </div>
                                </motion.div>
                              )}

                              {/* Default Content */}
                              {!hoveredCategory && (
                                <div className="flex-1 p-6 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-4xl mb-4">🏆</div>
                                    <h4 className="text-xl font-bold text-text-primary mb-2">
                                      Explore Our Sports Equipment
                                    </h4>
                                    <p className="text-text-secondary mb-4">
                                      Navigate through Categories → Sports → Items → Brands
                                    </p>
                                    <Link
                                      href="/products"
                                      className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                                    >
                                      View All Products
                                    </Link>
                                  </div>
                                </div>
                              )}

                              {hoveredCategory && !hoveredSport && (
                                <div className="flex-1 p-6 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-4xl mb-4">
                                      {sportsHierarchy[hoveredCategory].icon}
                                    </div>
                                    <h4 className="text-xl font-bold text-text-primary mb-2">
                                      {hoveredCategory}
                                    </h4>
                                    <p className="text-text-secondary mb-4">
                                      {sportsHierarchy[hoveredCategory].description}
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                      Hover over a sport to see available items
                                    </p>
                                  </div>
                                </div>
                              )}

                              {hoveredCategory && hoveredSport && !hoveredItem && (
                                <div className="flex-1 p-6 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-4xl mb-4">
                                      {sportsHierarchy[hoveredCategory].sports[hoveredSport].icon}
                                    </div>
                                    <h4 className="text-xl font-bold text-text-primary mb-2">
                                      {hoveredSport}
                                    </h4>
                                    <p className="text-text-secondary mb-4">
                                      {
                                        sportsHierarchy[hoveredCategory].sports[hoveredSport]
                                          .description
                                      }
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                      Hover over an item to see available brands
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      ref={navRefs.current[index]}
                      className={`relative px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold rounded-xl transition-all duration-150 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
                        ${hoveredIdx === index ? 'text-white bg-brand-primary font-bold' : 'text-text-primary hover:text-brand-primary hover:bg-brand-background'}`}
                      onMouseEnter={() => setHoveredIdx(index)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      role="menuitem"
                      aria-label={`Navigate to ${item.name}`}
                    >
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}

              {/* Shared rectangle background for non-dropdown items */}
              <AnimatePresence>
                {!isMobile &&
                  !reducedMotion &&
                  squircle.visible &&
                  hoveredIdx !== null &&
                  !navItems[hoveredIdx]?.hasDropdown &&
                  !megaMenuOpen && (
                    <motion.div
                      key="squircle-bg"
                      initial={
                        squircleAnimated
                          ? {
                              opacity: 1,
                              scale: 1,
                              left: squircle.left,
                              top: squircle.top,
                              width: squircle.width,
                              height: squircle.height,
                            }
                          : {
                              opacity: 0,
                              scale: 0.98,
                              left: lastSquircle.current.left,
                              top: lastSquircle.current.top,
                              width: lastSquircle.current.width,
                              height: lastSquircle.current.height,
                            }
                      }
                      animate={{
                        opacity: 1,
                        scale: 1,
                        left: squircle.left,
                        top: squircle.top,
                        width: squircle.width,
                        height: squircle.height,
                      }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 30, mass: 0.7 }}
                      style={{
                        position: 'absolute',
                        zIndex: 1,
                        borderRadius: '0.75rem',
                        background: '#FF6B35',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
              </AnimatePresence>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              <div style={{ transform: 'scale(1.1)' }}>
                <CartButton />
              </div>
              <Button
                size="sm"
                className="font-bold px-3 lg:px-5 py-2 text-sm lg:text-base rounded-full transition-all text-white shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ background: 'linear-gradient(135deg, var(--primary-orange), #FF8B35)' }}
                asChild
              >
                <Link href="/contact">
                  <Phone className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  <span className="hidden lg:inline">{SITE_CONFIG.branding.cta.contact}</span>
                  <span className="lg:hidden">Contact</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              <div style={{ transform: 'scale(1.1)' }}>
                <CartButton />
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={!reducedMotion ? { rotate: -90, opacity: 0 } : { opacity: 1 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={!reducedMotion ? { rotate: 90, opacity: 0 } : { opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={!reducedMotion ? { rotate: 90, opacity: 0 } : { opacity: 1 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={!reducedMotion ? { rotate: -90, opacity: 0 } : { opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
                    >
                      <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
              className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
              style={{ backgroundColor: 'rgba(45, 52, 54, 0.2)' }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Menu */}
            <motion.div
              id="mobile-menu"
              initial={!reducedMotion ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={!reducedMotion ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0.1 }
                  : {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }
              }
              className="fixed top-16 sm:top-20 left-3 right-3 sm:left-4 sm:right-4 bg-brand-surface/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-brand-border z-50 md:hidden overflow-hidden"
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="p-4 sm:p-6">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-text-primary hover:text-brand-primary hover:bg-gray-50 font-medium rounded-xl sm:rounded-2xl transition-all duration-200 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                        role="menuitem"
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}

                  <div className="pt-3 sm:pt-4 border-t border-brand-border mt-3 sm:mt-4">
                    <Button
                      size="lg"
                      className="w-full font-bold py-3 text-base rounded-xl sm:rounded-2xl text-white shadow-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 bg-brand-primary hover:bg-primary-600"
                      onClick={() => setIsOpen(false)}
                      asChild
                    >
                      <Link href="/contact">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {SITE_CONFIG.branding.cta.contact}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
