"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, RefreshCw, BookOpen, Settings, LogOut, Menu, X, Wheat, User, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { signOut } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Crop Rotation", href: "/dashboard/rotation", icon: RefreshCw },
  { name: "Education Hub", href: "/knowledge", icon: BookOpen },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, profile } = useAuth()

  const handleLogout = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Farmer'
  const farmLocation = profile?.farm_location || 'Farm Location'

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-2.5 rounded-xl group-hover:scale-105 transition-all duration-200 shadow-lg">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              KrishiChakra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || (item.href === "/knowledge" && pathname.startsWith("/knowledge"))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105",
                    isActive
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-green-50 transition-all duration-200">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{farmLocation}</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User info */}
              <div className="px-3 py-3 border-b border-gray-200/50 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-full">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">{farmLocation}</p>
                  </div>
                </div>
              </div>

              {/* Navigation items */}
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href || (item.href === "/knowledge" && pathname.startsWith("/knowledge"))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                        : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}

              {/* Logout */}
              <div className="pt-2 border-t border-gray-200/50">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-50 rounded-xl"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}