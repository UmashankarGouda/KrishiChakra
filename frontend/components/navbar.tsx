"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Wheat, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { signOut } from "@/lib/supabase"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile } = useAuth()
  const isAuthenticated = !!user

  const handleLogout = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full glass-light shadow-soft z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-professional p-2.5 rounded-xl group-hover:scale-105 transition-all duration-200 shadow-soft">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground tracking-tight">KrishiChakra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium hover:scale-105 transition-transform"
                >
                  Dashboard
                </Link>
                <Link
                  href="/knowledge"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium hover:scale-105 transition-transform"
                >
                  Knowledge Base
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-card rounded-xl border border-border shadow-soft">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{profile?.full_name || user?.email?.split('@')[0]}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-border hover:bg-accent bg-transparent rounded-xl shadow-soft hover:shadow-medium transition-all"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-all text-sm font-medium hover:scale-105"
                >
                  Features
                </Link>
                <Link
                  href="#about"
                  className="text-muted-foreground hover:text-foreground transition-all text-sm font-medium hover:scale-105"
                >
                  About
                </Link>
                <Link
                  href="#contact"
                  className="text-muted-foreground hover:text-foreground transition-all text-sm font-medium hover:scale-105"
                >
                  Contact
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-border hover:bg-accent bg-transparent rounded-xl shadow-soft hover:shadow-medium transition-all"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-professional hover:opacity-90 rounded-xl shadow-soft hover:shadow-medium transition-all"
                  asChild
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="rounded-xl">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-slide-in-left">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border shadow-medium rounded-b-xl">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-3 border-b border-border mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{profile?.full_name || user?.email?.split('@')[0]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{profile?.farm_location || "Farmer"}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/knowledge"
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Knowledge Base
                  </Link>
                  <div className="px-3 pt-2">
                    <Button variant="outline" className="w-full bg-transparent rounded-xl" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="#features"
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="#about"
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="#contact"
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                  <div className="flex flex-col space-y-2 px-3 pt-2">
                    <Button variant="outline" asChild className="rounded-xl bg-transparent">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="bg-gradient-professional hover:opacity-90 rounded-xl" asChild>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
