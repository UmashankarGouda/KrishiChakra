'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Smartphone, Monitor, BarChart3, Brain, Zap, Eye } from 'lucide-react'

export default function ProductDemoSection() {
  const [activeDemo, setActiveDemo] = useState('dashboard')

  const demoSections = [
    {
      id: 'dashboard',
      title: 'AI Dashboard',
      icon: Monitor,
      description: 'Real-time farm intelligence at your fingertips'
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      icon: Smartphone,
      description: 'Field-ready insights on your phone'
    },
    {
      id: 'analytics',
      title: 'Smart Analytics',
      icon: BarChart3,
      description: 'Deep insights and predictions'
    }
  ]

  const features = [
    {
      icon: Brain,
      title: 'AI Crop Recommendations',
      description: 'Get personalized suggestions based on your soil, weather, and market conditions',
      highlight: 'Increase yields by 35%'
    },
    {
      icon: Eye,
      title: 'Computer Vision',
      description: 'Detect diseases, pests, and nutrient deficiencies instantly with photo analysis',
      highlight: '95% accuracy rate'
    },
    {
      icon: Zap,
      title: 'Predictive Alerts',
      description: 'Receive early warnings about weather, pests, and optimal harvest timing',
      highlight: 'Save up to ₹50K per season'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2 font-medium mb-6">
            <Play className="w-4 h-4 mr-2" />
            Live Product Demo
          </Badge>
          
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            See KrishiChakra in Action
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how our AI-powered platform transforms complex agricultural data into simple, actionable insights that increase your profits.
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            {demoSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveDemo(section.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  activeDemo === section.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <section.icon className="w-5 h-5 mr-2" />
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Demo Display */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-16">
          {/* Mock Browser/App Chrome */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center bg-white rounded-lg px-4 py-1 text-sm text-gray-600 font-medium shadow-sm">
                  <Brain className="w-4 h-4 mr-2 text-green-500" />
                  {demoSections.find(s => s.id === activeDemo)?.description}
                </div>
              </div>
              <div className="w-16 flex justify-end">
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {/* Demo Content */}
          <div className="p-8 bg-gradient-to-br from-slate-50 to-white min-h-[500px]">
            {activeDemo === 'dashboard' && (
              <div className="animate-fade-in-scale">
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

                {/* Yield Prediction Chart */}
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
            )}

            {activeDemo === 'mobile' && (
              <div className="flex justify-center animate-fade-in-scale">
                <div className="w-80 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                  <div className="bg-white rounded-3xl overflow-hidden">
                    {/* Mobile App Header */}
                    <div className="bg-green-600 text-white p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold">KrishiChakra</h3>
                        <div className="bg-white/20 px-2 py-1 rounded text-xs">Mobile</div>
                      </div>
                      <p className="text-green-100 text-sm mt-1">Field Assistant AI</p>
                    </div>

                    {/* App Content */}
                    <div className="p-4 space-y-4">
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="font-medium text-red-900">Urgent Alert</span>
                        </div>
                        <p className="text-red-800 text-sm">Aphid infestation detected in Field A2</p>
                        <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700 text-xs">
                          View Treatment
                        </Button>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span className="font-medium text-blue-900">Weather Update</span>
                        </div>
                        <p className="text-blue-800 text-sm">Rain forecast: 15mm in 48 hours</p>
                        <Button size="sm" variant="outline" className="mt-2 border-blue-600 text-blue-600 text-xs">
                          Adjust Plan
                        </Button>
                      </div>

                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="font-medium text-green-900">Market Opportunity</span>
                        </div>
                        <p className="text-green-800 text-sm">Tomato prices up 12% - optimal selling time</p>
                        <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700 text-xs">
                          Find Buyers
                        </Button>
                      </div>
                    </div>

                    {/* Camera Feature */}
                    <div className="p-4 bg-gray-50">
                      <div className="bg-white rounded-xl p-4 text-center">
                        <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="font-medium text-gray-900 mb-1">AI Plant Doctor</p>
                        <p className="text-sm text-gray-600 mb-3">Take a photo for instant diagnosis</p>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs w-full">
                          <Play className="w-3 h-3 mr-1" />
                          Scan Plant
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'analytics' && (
              <div className="animate-fade-in-scale">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Profitability Analysis */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Profitability Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Expected Revenue</span>
                        <span className="font-bold text-green-600">₹4.2L</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">Total Costs</span>
                        <span className="font-bold text-red-600">₹2.8L</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <span className="text-gray-700 font-medium">Net Profit</span>
                        <span className="font-bold text-blue-600 text-lg">₹1.4L</span>
                      </div>
                      <div className="text-center p-3 bg-green-100 rounded-lg">
                        <span className="text-green-800 font-medium">↗ 42% increase vs last year</span>
                      </div>
                    </div>
                  </div>

                  {/* Resource Optimization */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Resource Optimization</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Water Usage</span>
                          <span className="text-green-600 font-medium">-25%</span>
                        </div>
                        <div className="bg-green-100 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Fertilizer Efficiency</span>
                          <span className="text-blue-600 font-medium">+30%</span>
                        </div>
                        <div className="bg-blue-100 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Pest Control</span>
                          <span className="text-purple-600 font-medium">-40%</span>
                        </div>
                        <div className="bg-purple-100 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-3 mt-4">
                        <p className="text-yellow-800 font-medium text-sm">💡 AI Suggestion</p>
                        <p className="text-yellow-700 text-sm mt-1">Switch to drip irrigation to save ₹15K more</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ML Insights */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Machine Learning Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-2">847</div>
                      <div className="text-blue-800 font-medium">Data Points Analyzed</div>
                      <div className="text-blue-600 text-sm mt-1">Per hour</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 mb-2">96.8%</div>
                      <div className="text-green-800 font-medium">Prediction Accuracy</div>
                      <div className="text-green-600 text-sm mt-1">Last 12 months</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 mb-2">₹2.1L</div>
                      <div className="text-purple-800 font-medium">Cost Savings</div>
                      <div className="text-purple-600 text-sm mt-1">This season</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Features Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium inline-block">
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Try Interactive Demo
          </Button>
          <p className="mt-4 text-gray-600">Experience the full platform with sample data</p>
        </div>
      </div>
    </section>
  )
}