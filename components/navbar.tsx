"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, ArrowLeft, ChefHat } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useCart } from "@/contexts/cart-context"

interface NavbarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  showSearch?: boolean
}

export function Navbar({ searchQuery = "", onSearchChange, showSearch = true }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const { getTotalItems } = useCart()

  const isHomePage = pathname === "/"
  const isItemDetailPage = pathname?.startsWith("/item/")

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value)
    onSearchChange?.(value)
  }

  const handleBackClick = () => {
    router.back()
  }

  const handleHomeClick = () => {
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center gap-3 lg:gap-4">
            {!isHomePage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="text-black hover:bg-gray-100 rounded-full p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleHomeClick}
            >
              <div className="bg-orange-500 rounded-full p-2">
                <ChefHat className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-black">Delicious</h1>
                <p className="text-sm text-gray-600 -mt-1">Restaurant</p>
              </div>
            </div>
          </div>

          <Button
            variant="default"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full bg-orange-500 hover:bg-orange-600 relative h-12 w-12 lg:h-14 lg:w-14 shadow-lg"
          >
            <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white font-semibold">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </div>

        {showSearch && isHomePage && (
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for delicious dishes, ingredients, or cuisines..."
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 lg:py-4 rounded-full border-gray-200 bg-white focus:bg-white text-base lg:text-lg text-black shadow-sm focus:shadow-md transition-all duration-200"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
