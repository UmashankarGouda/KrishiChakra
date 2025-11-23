"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, Leaf, IndianRupee, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { mockRotationPlans } from "@/lib/crop-data"
import Link from "next/link"

export default function CropRotationPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center drop-shadow-sm">
              <RefreshCw className="mr-4 h-10 w-10 text-green-600" />
              Crop Rotation Plans
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Explore scientifically-backed rotation strategies for optimal yields
            </p>
          </div>
          <Link href="/dashboard/rotation/custom">
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Create Custom Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Rotation Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {mockRotationPlans.map((plan) => (
          <Card key={plan.id} className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.season}</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Clock className="mr-1 h-3 w-3" />
                  {plan.duration}
                </Badge>
              </div>
              <CardDescription className="text-sm leading-relaxed">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Crop Sequence */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Leaf className="mr-2 h-4 w-4 text-green-600" />
                  Crop Sequence
                </h4>
                <div className="flex items-center space-x-2">
                  {plan.crops.map((crop, index) => (
                    <div key={index} className="flex items-center">
                      <Badge variant="outline" className="px-3 py-1">
                        {crop}
                      </Badge>
                      {index < plan.crops.length - 1 && <ArrowRight className="mx-2 h-3 w-3 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-800">Yield Increase</span>
                  </div>
                  <p className="text-lg font-bold text-green-700">{plan.expectedYield}</p>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <IndianRupee className="mr-1 h-4 w-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-800">Profit Est.</span>
                  </div>
                  <p className="text-lg font-bold text-orange-700">{plan.profitEstimate}</p>
                </div>
              </div>

              {/* Soil Benefits */}
              <div>
                <h4 className="font-semibold mb-3">Soil Health Benefits</h4>
                <ul className="space-y-2">
                  {plan.soilBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="mr-2 h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button className="flex-1 bg-gradient-agricultural hover:opacity-90">Implement Plan</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Saved Rotation Plans */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl mr-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
              </div>
            </div>
            Saved Rotation Plans
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">Review your previously generated rotation plans</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample Saved Plans */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-800">Summer 2025 Plan</h4>
                <Badge className="bg-green-600 text-white text-xs">Active</Badge>
              </div>
              <p className="text-sm text-green-700 mb-1">Rice → Wheat → Legumes</p>
              <p className="text-xs text-green-600">Created: March 15, 2025</p>
              <p className="text-xs text-green-600">Yield: +28% | Profit: ₹3.2L</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-800">Winter 2024 Plan</h4>
                <Badge variant="outline" className="border-blue-600 text-blue-600 text-xs">Completed</Badge>
              </div>
              <p className="text-sm text-blue-700 mb-1">Wheat → Mustard → Fallow</p>
              <p className="text-xs text-blue-600">Created: October 10, 2024</p>
              <p className="text-xs text-blue-600">Yield: +22% | Profit: ₹2.8L</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-orange-800">Custom Field Mix</h4>
                <Badge variant="outline" className="border-orange-600 text-orange-600 text-xs">Draft</Badge>
              </div>
              <p className="text-sm text-orange-700 mb-1">Multi-crop rotation</p>
              <p className="text-xs text-orange-600">Created: January 28, 2025</p>
              <p className="text-xs text-orange-600">Yield: +32% | Profit: ₹4.1L</p>
            </div>
          </div>
          
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 mb-4">View all your rotation planning history and track performance</p>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              View All Saved Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
