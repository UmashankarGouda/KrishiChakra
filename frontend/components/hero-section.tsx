'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, ArrowRight, Shield, Users, TrendingUp, Star, CheckCircle } from 'lucide-react'

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-green-50/30 py-16 sm:py-24 lg:py-32">
      {/* Sophisticated Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293714_1px,transparent_1px),linear-gradient(to_bottom,#1f293714_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Premium Floating Elements */}
      <div className="absolute top-24 left-16 w-2 h-2 bg-green-500 rounded-full opacity-40 animate-pulse" />
      <div className="absolute top-32 right-24 w-1 h-1 bg-emerald-600 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-24 w-1.5 h-1.5 bg-green-400 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Premium Trust Badge */}
          <div className="inline-flex items-center space-x-4 mb-8">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-sm px-4 py-2 font-medium border-0 shadow-sm">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by 15K+ Progressive Farmers
            </Badge>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-600 ml-2">4.9/5 from 2,847 reviews</span>
            </div>
          </div>

          {/* Powerful Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-tight">
            Transform Your Farm with
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent block mt-2">
              AI-Powered Intelligence
            </span>
          </h1>

          {/* Value-Focused Subheadline */}
          <p className="mt-8 text-xl leading-8 text-gray-600 max-w-3xl mx-auto font-medium">
            Make data-driven decisions that increase yields by <span className="font-bold text-green-600">35%</span> and 
            boost revenue by <span className="font-bold text-green-600">₹500CR+</span> across our network
          </p>

          {/* Results Proof Points */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Setup in 5 minutes
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              24/7 expert support
            </div>
          </div>

          {/* Premium CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 group"
              >
                Start Free 30-Day Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-200 hover:border-green-500 bg-white hover:bg-green-50 text-gray-700 hover:text-green-600 px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg group"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Live Demo
            </Button>
          </div>

          {/* Enterprise Stats Grid */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-16">
            <div className="group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">15,000+</div>
              <div className="text-gray-600 font-medium">Active Farmers</div>
              <div className="text-sm text-green-600 mt-1">Growing daily</div>
            </div>
            
            <div className="group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">35%</div>
              <div className="text-gray-600 font-medium">Average Yield Increase</div>
              <div className="text-sm text-blue-600 mt-1">Proven results</div>
            </div>
            
            <div className="group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">₹500CR+</div>
              <div className="text-gray-600 font-medium">Network Revenue Boost</div>
              <div className="text-sm text-emerald-600 mt-1">And counting</div>
            </div>
          </div>
        </div>

        {/* Premium Dashboard Mockup */}
        <div className="mt-24 relative mx-auto max-w-6xl">
          <div className="relative rounded-3xl bg-white shadow-2xl ring-1 ring-gray-900/5 overflow-hidden backdrop-blur-sm">
            {/* Browser Chrome */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center bg-white rounded-lg px-4 py-1 text-sm text-gray-600 font-medium shadow-sm">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    app.krishichakra.com
                  </div>
                </div>
                <div className="w-16"></div>
              </div>
            </div>

            {/* Dashboard Content - Matching Demo Section */}
            <div className="p-8 bg-gradient-to-br from-slate-50 to-white">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Farm Intelligence Dashboard</h3>
                  <p className="text-gray-600 mt-1">Real-time insights for optimal decisions</p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl text-sm font-medium">
                  Live Data
                </div>
              </div>

              {/* Weather Intelligence Cards - Same as Demo */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Weather Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Weather Intelligence</h3>
                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">LIVE</div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">25°C</div>
                  <div className="text-gray-600 text-sm mb-4">Perfect for wheat growth</div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-800 font-medium">⚠️ Rain expected in 3 days</div>
                    <div className="text-xs text-blue-600 mt-1">Consider harvesting early</div>
                  </div>
                </div>

                {/* Crop Health Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Crop Health AI</h3>
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">OPTIMAL</div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">97%</div>
                  <div className="text-gray-600 text-sm mb-4">Health Score</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nutrition</span>
                      <span className="text-green-600 font-medium">Excellent</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Disease Risk</span>
                      <span className="text-green-600 font-medium">Low</span>
                    </div>
                  </div>
                </div>

                {/* Market Insights Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Market Intelligence</h3>
                    <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">TRENDING</div>
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">₹2,850</div>
                  <div className="text-gray-600 text-sm mb-4">Per quintal (Wheat)</div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="text-sm text-orange-800 font-medium">📈 Price rising trend</div>
                    <div className="text-xs text-orange-600 mt-1">Best to sell in 5-7 days</div>
                  </div>
                </div>
              </div>

              {/* Yield Prediction Chart - Same as Demo */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Yield Prediction</h3>
                    <p className="text-gray-600 text-sm">Next 120 days forecast</p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
                    96% Confidence
                  </div>
                </div>
                <div className="h-64 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  <div className="text-center z-10">
                    <div className="text-4xl font-bold text-green-600 mb-2">2.4 Tons/Acre</div>
                    <div className="text-gray-600 mb-4">Predicted Yield</div>
                    <div className="inline-flex items-center bg-white/80 backdrop-blur rounded-lg px-4 py-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-green-700 font-medium">35% above average</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium Floating Accents */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </section>
  )
}