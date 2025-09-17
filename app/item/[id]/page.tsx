"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Star, Clock, Users, ThumbsUp, ShoppingCart, Heart, Share2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useCart } from "@/contexts/cart-context"
import { Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar"
import { SidebarCart } from "@/components/sidebar-cart"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  ingredients: string[]
  nutritionalInfo: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
  preparationTime: string
  servingSize: string
  spiceLevel: number
  isVegetarian: boolean
  allergens: string[]
  customizations: {
    name: string
    options: { name: string; price: number }[]
  }[]
}

const ENHANCED_MENU_ITEMS: MenuItem[] = [
  {
    id: "I101",
    name: "Grilled Chicken",
    description:
      "Tender grilled chicken marinated in aromatic herbs and spices, served with a side of fresh vegetables and mint chutney",
    price: 250,
    category: "Main Course",
    ingredients: ["Chicken breast", "Garlic", "Ginger", "Yogurt", "Cumin", "Coriander", "Turmeric", "Red chili powder"],
    nutritionalInfo: {
      calories: 320,
      protein: "28g",
      carbs: "5g",
      fat: "18g",
    },
    preparationTime: "15-20 minutes",
    servingSize: "1 portion (200g)",
    spiceLevel: 2,
    isVegetarian: false,
    allergens: ["Dairy"],
    customizations: [
      {
        name: "Spice Level",
        options: [
          { name: "Mild", price: 0 },
          { name: "Medium", price: 0 },
          { name: "Hot", price: 0 },
          { name: "Extra Hot", price: 10 },
        ],
      },
      {
        name: "Add-ons",
        options: [
          { name: "Extra Sauce", price: 20 },
          { name: "Grilled Vegetables", price: 40 },
          { name: "Cheese", price: 30 },
        ],
      },
    ],
  },
  {
    id: "I102",
    name: "Mutton Curry",
    description: "Rich and flavorful mutton curry slow-cooked with traditional spices and aromatic herbs",
    price: 300,
    category: "Main Course",
    ingredients: ["Mutton", "Onions", "Tomatoes", "Garam masala", "Bay leaves", "Cardamom", "Cinnamon", "Coconut milk"],
    nutritionalInfo: {
      calories: 420,
      protein: "35g",
      carbs: "12g",
      fat: "25g",
    },
    preparationTime: "25-30 minutes",
    servingSize: "1 portion (250g)",
    spiceLevel: 3,
    isVegetarian: false,
    allergens: ["None"],
    customizations: [
      {
        name: "Spice Level",
        options: [
          { name: "Mild", price: 0 },
          { name: "Medium", price: 0 },
          { name: "Hot", price: 0 },
        ],
      },
    ],
  },
  {
    id: "I103",
    name: "Fish Fry",
    description: "Crispy fried fish with coastal spices",
    price: 200,
    category: "Main Course",
    ingredients: ["Fish", "Turmeric", "Red chili powder", "Coriander", "Curry leaves", "Coconut oil"],
    nutritionalInfo: {
      calories: 280,
      protein: "25g",
      carbs: "8g",
      fat: "16g",
    },
    preparationTime: "12-15 minutes",
    servingSize: "1 portion (180g)",
    spiceLevel: 2,
    isVegetarian: false,
    allergens: ["Fish"],
    customizations: [
      {
        name: "Spice Level",
        options: [
          { name: "Mild", price: 0 },
          { name: "Medium", price: 0 },
          { name: "Hot", price: 0 },
        ],
      },
    ],
  },
  {
    id: "I201",
    name: "Chicken Kebab",
    description: "Juicy chicken kebabs grilled to perfection with aromatic spices",
    price: 150,
    category: "Starters",
    ingredients: ["Chicken", "Yogurt", "Ginger-garlic paste", "Red chili powder", "Garam masala", "Lemon juice"],
    nutritionalInfo: {
      calories: 280,
      protein: "22g",
      carbs: "3g",
      fat: "15g",
    },
    preparationTime: "12-15 minutes",
    servingSize: "4 pieces",
    spiceLevel: 2,
    isVegetarian: false,
    allergens: ["Dairy"],
    customizations: [
      {
        name: "Quantity",
        options: [
          { name: "4 pieces", price: 0 },
          { name: "6 pieces", price: 50 },
          { name: "8 pieces", price: 100 },
        ],
      },
    ],
  },
  {
    id: "I202",
    name: "Paneer Tikka",
    description: "Marinated paneer cubes grilled with colorful vegetables and aromatic spices",
    price: 120,
    category: "Starters",
    ingredients: ["Paneer", "Bell peppers", "Onions", "Yogurt", "Tandoori masala", "Mint chutney"],
    nutritionalInfo: {
      calories: 240,
      protein: "15g",
      carbs: "8g",
      fat: "18g",
    },
    preparationTime: "10-12 minutes",
    servingSize: "6 pieces",
    spiceLevel: 1,
    isVegetarian: true,
    allergens: ["Dairy"],
    customizations: [
      {
        name: "Extra Vegetables",
        options: [
          { name: "None", price: 0 },
          { name: "Extra Bell Peppers", price: 20 },
          { name: "Extra Onions", price: 15 },
        ],
      },
    ],
  },
  {
    id: "I301",
    name: "Mango Lassi",
    description: "Refreshing mango yogurt drink",
    price: 80,
    category: "Drinks",
    ingredients: ["Mango pulp", "Yogurt", "Sugar", "Cardamom", "Ice"],
    nutritionalInfo: {
      calories: 150,
      protein: "4g",
      carbs: "28g",
      fat: "3g",
    },
    preparationTime: "3-5 minutes",
    servingSize: "1 glass (250ml)",
    spiceLevel: 0,
    isVegetarian: true,
    allergens: ["Dairy"],
    customizations: [
      {
        name: "Sweetness",
        options: [
          { name: "Less Sweet", price: 0 },
          { name: "Regular", price: 0 },
          { name: "Extra Sweet", price: 0 },
        ],
      },
    ],
  },
  {
    id: "I302",
    name: "Fresh Lime Soda",
    description: "Zesty lime soda with mint",
    price: 60,
    category: "Drinks",
    ingredients: ["Fresh lime juice", "Soda water", "Mint leaves", "Salt", "Sugar", "Ice"],
    nutritionalInfo: {
      calories: 45,
      protein: "0g",
      carbs: "12g",
      fat: "0g",
    },
    preparationTime: "2-3 minutes",
    servingSize: "1 glass (300ml)",
    spiceLevel: 0,
    isVegetarian: true,
    allergens: ["None"],
    customizations: [
      {
        name: "Flavor",
        options: [
          { name: "Sweet", price: 0 },
          { name: "Salty", price: 0 },
          { name: "Mixed", price: 0 },
        ],
      },
    ],
  },
]

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>({})
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart, updateQuantity, getTotalItems, items } = useCart()
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Lauralee Quintero",
      avatar: "/woman-profile.png",
      rating: 5,
      comment: "Loving this recipe! So many delicious recipes to choose from ❤️❤️❤️",
      likes: 356,
      timeAgo: "1 month ago",
    },
    {
      id: 2,
      name: "Benny Spanbauer",
      avatar: "/man-profile.png",
      rating: 5,
      comment: "Makes salad planning a breeze. I can easily find recipes based on ingredients I have on hand 🥗",
      likes: 283,
      timeAgo: "3 months ago",
    },
    {
      id: 3,
      name: "Janetta Ratolo",
      avatar: "/woman-profile-two.png",
      rating: 5,
      comment: "Step-by-step instructions and photos make it easy to follow along and cook amazing salad 🔥🔥",
      likes: 194,
      timeAgo: "2 weeks ago",
    },
  ])
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set())
  const [isFavorite, setIsFavorite] = useState(false)

  const [currentPartition, setCurrentPartition] = useState({
    partition_no: 1,
    status: "open" as const,
    items: [],
    subtotal: 0,
  })

  const [partitions, setPartitions] = useState<any[]>([])

  useEffect(() => {
    const cartItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    setCurrentPartition({
      partition_no: 1,
      status: "open",
      items: cartItems,
      subtotal: subtotal,
    })
  }, [items])

  const updateCurrentPartition = (items: any[]) => {
    items.forEach((item) => {
      updateQuantity(item.id, 0)
    })

    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item)
      }
    })
  }

  const item = ENHANCED_MENU_ITEMS.find((item) => item.id === params.id)

  if (!item) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Item not found</h1>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const handleAddReview = () => {
    if (newReview.trim()) {
      const review = {
        id: reviews.length + 1,
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: newRating,
        comment: newReview,
        likes: 0,
        timeAgo: "Just now",
      }
      setReviews([review, ...reviews])
      setNewReview("")
      setNewRating(5)
    }
  }

  const handleLikeReview = (reviewId: number) => {
    const newLikedReviews = new Set(likedReviews)
    if (likedReviews.has(reviewId)) {
      newLikedReviews.delete(reviewId)
      setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, likes: review.likes - 1 } : review)))
    } else {
      newLikedReviews.add(reviewId)
      setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, likes: review.likes + 1 } : review)))
    }
    setLikedReviews(newLikedReviews)
  }

  const handleAddToCart = (itemName: string) => {
    if (item) {
      const existingCartItem = items.find((cartItem) => cartItem.id === item.id)

      if (existingCartItem) {
        updateQuantity(item.id, existingCartItem.quantity + quantity)
      } else {
        addToCart({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          ingredients: item.ingredients,
        })
        if (quantity > 1) {
          setTimeout(() => {
            updateQuantity(item.id, quantity)
          }, 0)
        }
      }
      console.log(`Added ${quantity}x ${itemName} to cart`)
    }
  }

  const handleRelatedItemClick = (itemId: string) => {
    router.push(`/item/${itemId}`)
  }

  const itemImages = [
    `/abstract-geometric-shapes.png?key=img1&height=400&width=400&query=${encodeURIComponent(item.name + " food dish")}`,
    `/abstract-geometric-shapes.png?key=img2&height=400&width=400&query=${encodeURIComponent(item.name + " ingredients")}`,
    `/abstract-geometric-shapes.png?key=img3&height=400&width=400&query=${encodeURIComponent(item.name + " preparation")}`,
    `/abstract-geometric-shapes.png?key=img4&height=400&width=400&query=${encodeURIComponent(item.name + " plated")}`,
  ]

  const ingredientEmojis: Record<string, string> = {
    "Chicken breast": "🍗",
    Garlic: "🧄",
    Ginger: "🫚",
    Yogurt: "🥛",
    Cumin: "🌿",
    Coriander: "🌿",
    Turmeric: "🌿",
    "Red chili powder": "🌶️",
    Mutton: "🥩",
    Onions: "🧅",
    Tomatoes: "🍅",
    "Garam masala": "🌿",
    "Bay leaves": "🍃",
    Cardamom: "🌿",
    Cinnamon: "🌿",
    "Coconut milk": "🥥",
    Fish: "🐟",
    "Curry leaves": "🍃",
    "Coconut oil": "🥥",
    Paneer: "🧀",
    "Bell peppers": "🫑",
    "Tandoori masala": "🌿",
    "Mint chutney": "🌿",
    "Mango pulp": "🥭",
    Sugar: "🍯",
    Ice: "🧊",
    "Fresh lime juice": "🍋",
    "Soda water": "💧",
    "Mint leaves": "🌿",
    Salt: "🧂",
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Sidebar side="right" className="w-96">
        <SidebarContent>
          <SidebarCart
            tableInfo={{ tableId: "T01", tableName: "Table 1" }}
            currentPartition={currentPartition}
            partitions={partitions}
            onUpdatePartition={updateCurrentPartition}
            onConfirmPartition={(partition) => {
              setPartitions([...partitions, { ...partition, status: "confirmed" }])
              items.forEach((item) => {
                updateQuantity(item.id, 0)
              })
            }}
            onProceedToPayment={() => {}}
          />
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <Navbar showSearch={false} />

        <div className="px-4 lg:px-8 pb-24 lg:pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6 lg:mb-8">
              <div className="aspect-square lg:aspect-[16/10] rounded-2xl lg:rounded-3xl overflow-hidden bg-white shadow-lg">
                <img
                  src={item.image || itemImages[currentImageIndex] || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-black"}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
                  >
                    <Share2 className="h-4 w-4 text-black" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mt-4 gap-2">
                {itemImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? "bg-orange-500 w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                <div className="mb-6 lg:mb-8">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h1 className="text-2xl lg:text-4xl font-bold mb-2 leading-tight text-black">{item.name}</h1>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium text-black">4.8</span>
                          <span className="text-sm text-gray-600">(124 reviews)</span>
                        </div>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{item.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl lg:text-4xl font-bold text-orange-500">₹{item.price}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-base lg:text-lg">{item.description}</p>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-black">{item.preparationTime.split("-")[0].trim()}</span>
                    <span className="text-xs text-gray-600">mins</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-black">{item.servingSize.split(" ")[0]}</span>
                    <span className="text-xs text-gray-600">serving</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200">
                    <span className="text-sm font-medium text-black">{item.nutritionalInfo.calories}</span>
                    <span className="text-xs text-gray-600">cal</span>
                  </div>
                </div>

                <div className="mb-8 lg:mb-12">
                  <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-black">Ingredients</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.ingredients.slice(0, 6).map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{ingredientEmojis[ingredient] || "🥄"}</span>
                        </div>
                        <span className="text-black font-medium">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl lg:text-2xl font-bold text-black">Reviews ({reviews.length})</h2>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {reviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200">
                        <img
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-black">{review.name}</span>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{review.comment}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <button
                              onClick={() => handleLikeReview(review.id)}
                              className={`flex items-center gap-1 hover:text-orange-500 transition-colors ${
                                likedReviews.has(review.id) ? "text-orange-500" : ""
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>{review.likes}</span>
                            </button>
                            <span>{review.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-black mb-4">Nutritional Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calories</span>
                        <span className="font-medium text-black">{item.nutritionalInfo.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protein</span>
                        <span className="font-medium text-black">{item.nutritionalInfo.protein}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carbs</span>
                        <span className="font-medium text-black">{item.nutritionalInfo.carbs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fat</span>
                        <span className="font-medium text-black">{item.nutritionalInfo.fat}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-black mb-4">Allergen Information</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map((allergen, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
              <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border-gray-200 text-black"
                    >
                      -
                    </Button>
                    <span className="font-semibold text-lg w-8 text-center text-black">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border-gray-200 text-black"
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(item.name)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 text-base font-semibold rounded-full shadow-lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add ₹{item.price * quantity}
                  </Button>
                </div>
              </div>
            </div>

            <div className="hidden lg:block mt-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-6 p-6 bg-white rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-full border-gray-200 text-black"
                    >
                      -
                    </Button>
                    <span className="font-semibold text-xl w-12 text-center text-black">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-full border-gray-200 text-black"
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(item.name)}
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - ₹{item.price * quantity}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}
