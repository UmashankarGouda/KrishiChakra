"use client"

import type React from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-blue-50/30">
        <DashboardNavbar />
        <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
