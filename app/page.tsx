"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, Clock, Users } from "lucide-react"
import { SidebarCart } from "@/components/sidebar-cart"
import { PaymentFlow } from "@/components/payment-flow"
import { MENU_ITEMS, CATEGORIES, type MenuItem } from "@/lib/menu-data"
import { Sidebar, SidebarContent, SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useCart } from "@/contexts/cart-context"

interface CartItem extends MenuItem {
  quantity: number
}

interface Partition {
  partition_no: number
  status: "open" | "confirmed"
  items: CartItem[]
  subtotal: number
}

export default function RestaurantApp() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [partitions, setPartitions] = useState<Partition[]>([])
  const [currentPartition, setCurrentPartition] = useState<Partition>({
    partition_no: 1,
    status: "open",
    items: [],
    subtotal: 0,
  })
  const [showPayment, setShowPayment] = useState(false)
  const { toggleSidebar } = useSidebar()
  const router = useRouter()
  const { items: globalCartItems, addToCart, updateQuantity, getTotalItems } = useCart()

  useEffect(() => {
    const cartItems: CartItem[] = globalCartItems.map((item) => ({
      ...item,
      quantity: item.quantity,
    }))

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    setCurrentPartition((prev) => ({
      ...prev,
      items: cartItems,
      subtotal,
    }))
  }, [globalCartItems])

  const updateCurrentPartition = (items: CartItem[]) => {
    // Clear global cart first
    globalCartItems.forEach((item) => {
      updateQuantity(item.id, 0)
    })

    // Add new items to global cart
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item)
      }
    })
  }

  const handleProceedToPayment = () => {
    toggleSidebar()
    setShowPayment(true)
  }

  const handleItemClick = (itemId: string) => {
    router.push(`/item/${itemId}`)
  }

  const handleAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation()
    addToCart(item)
  }

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients?.some((ingredient) => ingredient.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const totalItems = getTotalItems()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar side="right" className="w-96">
        <SidebarContent>
          <SidebarCart
            tableInfo={{ tableId: "T01", tableName: "Table 1" }}
            currentPartition={currentPartition}
            partitions={partitions}
            onUpdatePartition={updateCurrentPartition}
            onConfirmPartition={(partition) => {
              setPartitions([...partitions, { ...partition, status: "confirmed" }])
              globalCartItems.forEach((item) => {
                updateQuantity(item.id, 0)
              })
              setCurrentPartition({
                partition_no: partitions.length + 2,
                status: "open",
                items: [],
                subtotal: 0,
              })
            }}
            onProceedToPayment={handleProceedToPayment}
          />
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cartItemCount={totalItems}
          showSearch={true}
        />

        <main className="container mx-auto px-4 lg:px-8 py-6 lg:py-8">
          <div className="space-y-8">
            <div className="text-center py-8 lg:py-12">
              <h2 className="text-3xl lg:text-5xl font-bold text-black mb-4">Discover Amazing Flavors</h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                From traditional favorites to modern creations, explore our carefully crafted menu
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
              {["All", ...CATEGORIES].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-6 py-3 text-base font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
                      : "bg-white text-black border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {searchQuery && (
              <div className="text-center">
                <p className="text-gray-600">
                  Found <span className="font-semibold text-black">{filteredItems.length}</span> results for "
                  {searchQuery}"
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer hover:scale-105 transition-all duration-300 ease-out"
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={
                          item.image ||
                          `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(item.name + " food dish") || "/placeholder.svg"}`
                        }
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-xs font-medium text-black">15 min</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-medium text-black">4.8</span>
                        </div>
                      </div>

                      <Button
                        onClick={(e) => handleAddToCart(e, item)}
                        size="icon"
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-black hover:bg-orange-500 hover:text-white shadow-lg transition-all duration-200"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-black group-hover:text-orange-500 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="text-xl font-bold text-orange-500">₹{item.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">1-2 servings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-600 text-xl mb-2">No dishes found</div>
                <div className="text-gray-500">Try adjusting your search or category filter</div>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>

      {showPayment && (
        <PaymentFlow
          tableInfo={{ tableId: "T01", tableName: "Table 1" }}
          partitions={partitions}
          currentPartition={currentPartition.items.length > 0 ? currentPartition : null}
          onClose={() => setShowPayment(false)}
          onPaymentComplete={() => {
            setPartitions([])
            globalCartItems.forEach((item) => {
              updateQuantity(item.id, 0)
            })
            setCurrentPartition({
              partition_no: 1,
              status: "open",
              items: [],
              subtotal: 0,
            })
            setShowPayment(false)
          }}
        />
      )}
    </div>
  )
}
