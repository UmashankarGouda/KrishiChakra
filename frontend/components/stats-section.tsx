"use client"

import { TrendingUp, Users, Leaf, Award } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Farmers Empowered",
    description: "Across 15 Indian states",
  },
  {
    icon: TrendingUp,
    value: "25%",
    label: "Average Yield Increase",
    description: "Through smart rotation",
  },
  {
    icon: Leaf,
    value: "500+",
    label: "Crop Varieties",
    description: "In our database",
  },
  {
    icon: Award,
    value: "98%",
    label: "Farmer Satisfaction",
    description: "Based on user feedback",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Farmers Across India</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of progressive farmers who have transformed their agricultural practices with KrishiChakra
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-agricultural rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
