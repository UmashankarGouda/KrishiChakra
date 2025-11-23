"use client"

import { Brain, BarChart3, Shield, Smartphone, Globe, Zap } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    description:
      "Get personalized crop rotation plans based on your soil type, climate, and farming goals using advanced machine learning algorithms.",
  },
  {
    icon: BarChart3,
    title: "Yield Optimization",
    description:
      "Maximize your harvest with data-driven insights that help you choose the right crops for each season and field.",
  },
  {
    icon: Shield,
    title: "Soil Health Protection",
    description:
      "Maintain and improve soil fertility through scientifically-backed rotation patterns that prevent nutrient depletion.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Access your farming plans anywhere with our responsive web app designed specifically for Indian farmers.",
  },
  {
    icon: Globe,
    title: "Regional Expertise",
    description:
      "Tailored recommendations for different Indian agro-climatic zones, considering local weather patterns and market demands.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description:
      "Stay informed with weather alerts, market prices, and seasonal recommendations delivered directly to your dashboard.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-agricultural">Grow Smarter</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            KrishiChakra combines traditional farming wisdom with modern technology to help you make informed decisions
            about crop rotation and farm management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-agricultural rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
