'use client'

import { useState } from 'react'
import { createProduct } from '@/lib/products'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Package,
  Upload,
  X,
  Plus,
  Save,
  ArrowLeft,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Boxes,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductVariant {
  id: string
  name: string
  size?: string
  color?: string
  price: number
  inventory: number
  sku?: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Basic Product Information
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [stock, setStock] = useState('')
  const [lowStockThreshold, setLowStockThreshold] = useState('5')
  const [status, setStatus] = useState('draft')

  // Categories and Brands
  const [sportCategory, setSportCategory] = useState('')
  const [sport, setSport] = useState('')
  const [sportItem, setSportItem] = useState('')
  const [brand, setBrand] = useState('')

  // Product Features and Specifications
  const [features, setFeatures] = useState<string[]>([''])
  const [tags, setTags] = useState('')
  const [material, setMaterial] = useState('')
  const [weight, setWeight] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [careInstructions, setCareInstructions] = useState('')

  // Images
  const [images, setImages] = useState<{ url: string; altText: string }[]>([])

  // Variants
  const [useVariants, setUseVariants] = useState(false)
  const [variants, setVariants] = useState<ProductVariant[]>([])

  // SEO
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')

  // Mock data for dropdowns
  const categories = [
    { value: 'ball-sports', label: 'Ball Sports' },
    { value: 'racquet-sports', label: 'Racquet Sports' },
    { value: 'field-sports', label: 'Field Sports' },
    { value: 'training', label: 'Training Equipment' },
  ]

  const sports = [
    { value: 'cricket', label: 'Cricket', category: 'ball-sports' },
    { value: 'rugby', label: 'Rugby', category: 'ball-sports' },
    { value: 'basketball', label: 'Basketball', category: 'ball-sports' },
    { value: 'tennis', label: 'Tennis', category: 'racquet-sports' },
    { value: 'badminton', label: 'Badminton', category: 'racquet-sports' },
    { value: 'hockey', label: 'Hockey', category: 'field-sports' },
    { value: 'football', label: 'Football', category: 'field-sports' },
  ]

  const sportItems = [
    { value: 'bats', label: 'Bats', sport: 'cricket' },
    { value: 'balls', label: 'Balls', sport: 'cricket' },
    { value: 'protective', label: 'Protective Gear', sport: 'cricket' },
    { value: 'balls', label: 'Balls', sport: 'rugby' },
    { value: 'protective', label: 'Protective Gear', sport: 'rugby' },
    { value: 'balls', label: 'Balls', sport: 'basketball' },
    { value: 'rackets', label: 'Rackets', sport: 'tennis' },
    { value: 'strings', label: 'Strings', sport: 'tennis' },
    { value: 'rackets', label: 'Rackets', sport: 'badminton' },
    { value: 'strings', label: 'Strings', sport: 'badminton' },
    { value: 'sticks', label: 'Sticks', sport: 'hockey' },
    { value: 'balls', label: 'Balls', sport: 'hockey' },
  ]

  const brands = [
    { value: 'gray-nicolls', label: 'Gray-Nicolls' },
    { value: 'gilbert', label: 'Gilbert' },
    { value: 'grays', label: 'Grays' },
    { value: 'babolat', label: 'Babolat' },
    { value: 'molten', label: 'Molten' },
    { value: 'ashaway', label: 'Ashaway' },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In a real app, you would upload these to your media storage
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file)
        setImages((prev) => [...prev, { url, altText: '' }])
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const updateImageAltText = (index: number, altText: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, altText } : img)))
  }

  const addFeature = () => {
    setFeatures((prev) => [...prev, ''])
  }

  const updateFeature = (index: number, value: string) => {
    setFeatures((prev) => prev.map((feature, i) => (i === index ? value : feature)))
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      name: '',
      price: parseFloat(price) || 0,
      inventory: 0,
    }
    setVariants((prev) => [...prev, newVariant])
  }

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants((prev) =>
      prev.map((variant) => (variant.id === id ? { ...variant, ...updates } : variant)),
    )
  }

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((variant) => variant.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Build PayloadCMS product data
      const productData = {
        title: name,
        slug: sku || `rs-${Date.now()}`,
        description,
        sku: sku || `RS-${Date.now()}`,
        status: (['active', 'draft', 'archived'].includes(status) ? status : 'draft') as
          | 'active'
          | 'draft'
          | 'archived',
        brand: {
          id: brand,
          name: brand,
          slug: brand,
          featured: false,
          createdAt: '',
          updatedAt: '',
        },
        categories: sportCategory
          ? [
              {
                id: sportCategory,
                name: sportCategory,
                slug: sportCategory,
                createdAt: '',
                updatedAt: '',
              },
            ]
          : [],
        images: images.map((img) => ({ id: '', url: img.url, alt: img.altText })),
        variants: useVariants
          ? variants.map((v) => ({
              id: v.id,
              name: v.name,
              price: v.price,
              inventory: v.inventory,
              sku: (v.sku ?? sku) || `RS-${Date.now()}`,
              size: v.size,
              color: v.color,
              options: {},
            }))
          : [
              {
                id: '1',
                name,
                price: parseFloat(price) || 0,
                inventory: parseInt(stock) || 0,
                sku: sku || `RS-${Date.now()}`,
                options: {},
              },
            ],
        tags: tags.split(',').map((t) => t.trim()),
        featured: false,
        specifications: { material, weight, dimensions, careInstructions },
        seo: { title: seoTitle, description: seoDescription },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Use PayloadCMS API utility
      const created = await createProduct(productData)
      if (created) {
        router.push('/dashboard/products')
      } else {
        setError('Product creation failed!')
      }
    } catch (error) {
      setError('Failed to create product. Please try again.')
      console.error('Product creation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSports = sports.filter((s) => s.category === sportCategory)
  const filteredSportItems = sportItems.filter((item) => item.sport === sport)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Add New Product</h1>
            <p className="text-text-secondary mt-2">Create a new product in your catalog</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" type="button">
            Save as Draft
          </Button>
          <Button type="submit" form="product-form" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Product
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>Essential product details and identification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Gray-Nicolls Ventus Cricket Bat"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-sm font-medium">
                      SKU (Optional)
                    </Label>
                    <Input
                      id="sku"
                      placeholder="Auto-generated if empty"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed product description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Categories & Brand
                </CardTitle>
                <CardDescription>Organize your product in the right categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sportCategory" className="text-sm font-medium">
                      Sport Category *
                    </Label>
                    <Select value={sportCategory} onValueChange={setSportCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sport" className="text-sm font-medium">
                      Sport *
                    </Label>
                    <Select
                      value={sport}
                      onValueChange={setSport}
                      required
                      disabled={!sportCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSports.map((sportOption) => (
                          <SelectItem key={sportOption.value} value={sportOption.value}>
                            {sportOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sportItem" className="text-sm font-medium">
                      Sport Item *
                    </Label>
                    <Select
                      value={sportItem}
                      onValueChange={setSportItem}
                      required
                      disabled={!sport}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport item" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSportItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-sm font-medium">
                      Brand *
                    </Label>
                    <Select value={brand} onValueChange={setBrand} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brandOption) => (
                          <SelectItem key={brandOption.value} value={brandOption.value}>
                            {brandOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing & Inventory
                </CardTitle>
                <CardDescription>Set product pricing and stock levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">
                      Selling Price (LKR) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="25000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice" className="text-sm font-medium">
                      Original Price (LKR)
                    </Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      placeholder="30000"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costPrice" className="text-sm font-medium">
                      Cost Price (LKR)
                    </Label>
                    <Input
                      id="costPrice"
                      type="number"
                      placeholder="20000"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useVariants"
                    checked={useVariants}
                    onCheckedChange={(checked) => setUseVariants(checked as boolean)}
                  />
                  <Label htmlFor="useVariants" className="text-sm font-medium">
                    This product has variants (size, color, etc.)
                  </Label>
                </div>

                {!useVariants && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-medium">
                        Stock Quantity *
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="50"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold" className="text-sm font-medium">
                        Low Stock Threshold
                      </Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        placeholder="5"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Variants */}
            {useVariants && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Boxes className="h-5 w-5 mr-2" />
                        Product Variants
                      </CardTitle>
                      <CardDescription>
                        Define different variations of this product (size, color, etc.)
                      </CardDescription>
                    </div>
                    <Button type="button" onClick={addVariant} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {variants.length === 0 ? (
                    <div className="text-center py-8">
                      <Boxes className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                      <p className="text-text-secondary">No variants added yet</p>
                      <Button type="button" onClick={addVariant} size="sm" className="mt-2">
                        Add First Variant
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="border border-brand-border rounded-lg p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Variant {variants.indexOf(variant) + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariant(variant.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Variant Name</Label>
                              <Input
                                placeholder="e.g., Large / Red"
                                value={variant.name}
                                onChange={(e) =>
                                  updateVariant(variant.id, { name: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Size</Label>
                              <Input
                                placeholder="e.g., L, XL, 42"
                                value={variant.size || ''}
                                onChange={(e) =>
                                  updateVariant(variant.id, { size: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Color</Label>
                              <Input
                                placeholder="e.g., Red, Blue"
                                value={variant.color || ''}
                                onChange={(e) =>
                                  updateVariant(variant.id, { color: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Price (LKR)</Label>
                              <Input
                                type="number"
                                value={variant.price}
                                onChange={(e) =>
                                  updateVariant(variant.id, {
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Stock</Label>
                              <Input
                                type="number"
                                value={variant.inventory}
                                onChange={(e) =>
                                  updateVariant(variant.id, {
                                    inventory: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">SKU (Optional)</Label>
                              <Input
                                placeholder="Auto-generated"
                                value={variant.sku || ''}
                                onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Product Features */}
            <Card>
              <CardHeader>
                <CardTitle>Product Features</CardTitle>
                <CardDescription>Highlight key features and selling points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="e.g., Breathable fabric, Waterproof, Lightweight"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        disabled={features.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFeature} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">
                    Tags (comma separated)
                  </Label>
                  <Input
                    id="tags"
                    placeholder="running, outdoor, breathable, comfortable"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>Technical details and product specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material" className="text-sm font-medium">
                      Material
                    </Label>
                    <Input
                      id="material"
                      placeholder="Cotton, Polyester, Leather, etc."
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm font-medium">
                      Weight
                    </Label>
                    <Input
                      id="weight"
                      placeholder="250g, 1.2kg, etc."
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions" className="text-sm font-medium">
                      Dimensions
                    </Label>
                    <Input
                      id="dimensions"
                      placeholder="30cm x 20cm x 10cm"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="careInstructions" className="text-sm font-medium">
                    Care Instructions
                  </Label>
                  <Textarea
                    id="careInstructions"
                    placeholder="Machine wash cold, air dry..."
                    value={careInstructions}
                    onChange={(e) => setCareInstructions(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Visibility */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
                <CardDescription>Control product visibility and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Product Status
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Badge
                    variant="outline"
                    className={
                      status === 'active'
                        ? 'bg-green-500/10 text-green-700 border-green-200'
                        : status === 'draft'
                          ? 'bg-gray-500/10 text-gray-700 border-gray-200'
                          : 'bg-red-500/10 text-red-700 border-red-200'
                    }
                  >
                    {status === 'active' && '✓ '}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Product Images
                </CardTitle>
                <CardDescription>
                  Upload product images (first image will be primary)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="border border-brand-border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Image {index + 1} {index === 0 && '(Primary)'}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-full h-32 bg-brand-background rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.altText || `Product image ${index + 1}`}
                          width={200}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Input
                        placeholder="Alt text for this image"
                        value={image.altText}
                        onChange={(e) => updateImageAltText(index, e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-brand-border rounded-lg p-6 text-center">
                    <ImageIcon className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                    <p className="text-sm text-text-secondary mb-2">
                      Drag and drop images here, or click to select
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button type="button" variant="outline" size="sm" asChild>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle" className="text-sm font-medium">
                    SEO Title
                  </Label>
                  <Input
                    id="seoTitle"
                    placeholder="Product Name - Brand | Ralhum Sports"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription" className="text-sm font-medium">
                    SEO Description
                  </Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="Shop product name at Ralhum Sports. High-quality sports equipment..."
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
