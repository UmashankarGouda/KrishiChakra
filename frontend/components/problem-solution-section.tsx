'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, AlertTriangle, TrendingDown, CloudRain, Bug, DollarSign, Target } from 'lucide-react'

export default function ProblemSolutionSection() {
  const problems = [
    {
      icon: TrendingDown,
      title: "Unpredictable Yields",
      description: "Traditional farming methods lead to inconsistent harvests and revenue uncertainty",
      impact: "30-40% yield variations"
    },
    {
      icon: CloudRain,
      title: "Weather Dependency",
      description: "Climate unpredictability causes crop failures and massive financial losses",
      impact: "₹50K+ losses per season"
    },
    {
      icon: Bug,
      title: "Pest & Disease Outbreaks",
      description: "Late detection of issues results in widespread crop damage and chemical overuse",
      impact: "25% average crop loss"
    },
    {
      icon: DollarSign,
      title: "Market Price Volatility",
      description: "Farmers sell at unfavorable prices due to lack of market intelligence",
      impact: "20-30% revenue loss"
    }
  ]

  const solutions = [
    {
      icon: Target,
      title: "AI-Powered Precision",
      description: "Machine learning algorithms analyze thousands of data points to optimize every farming decision",
      benefit: "35% yield increase"
    },
    {
      icon: CloudRain,
      title: "Weather Intelligence",
      description: "Advanced meteorological data and predictions help you plan and protect your crops",
      benefit: "90% risk reduction"
    },
    {
      icon: Bug,
      title: "Early Detection System",
      description: "Computer vision and IoT sensors identify pest and disease threats before they spread",
      benefit: "80% faster response"
    },
    {
      icon: TrendingDown,
      title: "Market Analytics",
      description: "Real-time price forecasting and demand analysis ensure optimal selling strategies",
      benefit: "25% better prices"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Stop Losing Money to 
            <span className="text-red-600 block mt-2">Preventable Farming Problems</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional farming methods are costing Indian farmers billions. KrishiChakra uses AI to solve these age-old challenges with modern solutions.
          </p>
        </div>

        {/* Problems vs Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Problems Side */}
          <div>
            <div className="flex items-center mb-8">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-4" />
              <h3 className="text-2xl font-bold text-gray-900">The Problems You Face Daily</h3>
            </div>

            <div className="space-y-6">
              {problems.map((problem, index) => (
                <div key={index} className="bg-red-50 border border-red-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <problem.icon className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h4>
                      <p className="text-gray-600 mb-3">{problem.description}</p>
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm font-medium inline-block">
                        Impact: {problem.impact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions Side */}
          <div>
            <div className="flex items-center mb-8">
              <Target className="w-8 h-8 text-green-500 mr-4" />
              <h3 className="text-2xl font-bold text-gray-900">Our AI-Powered Solutions</h3>
            </div>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <div key={index} className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <solution.icon className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h4>
                      <p className="text-gray-600 mb-3">{solution.description}</p>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium inline-block">
                        Result: {solution.benefit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Before/After Stories */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Real Farmer Transformations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before Story */}
            <div className="bg-red-50 border border-red-100 rounded-3xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-xl font-bold text-red-900">Before KrishiChakra</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Lost ₹1.2L due to unexpected pest attack</span>
                </div>
                <div className="flex items-center text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Wasted ₹30K on ineffective fertilizers</span>
                </div>
                <div className="flex items-center text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Sold crops 25% below market price</span>
                </div>
                <div className="flex items-center text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Stressed about unpredictable income</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-xl">
                <p className="text-red-900 font-medium italic">
                  "Every season felt like gambling. I never knew if I'd make profit or loss."
                </p>
                <p className="text-red-700 text-sm mt-2">- Rajesh Kumar, Punjab</p>
              </div>
            </div>

            {/* After Story */}
            <div className="bg-green-50 border border-green-100 rounded-3xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-green-900">After KrishiChakra</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Prevented pest outbreak, saved ₹80K</span>
                </div>
                <div className="flex items-center text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Optimized fertilizer use, saved ₹25K</span>
                </div>
                <div className="flex items-center text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Sold at peak prices, earned 30% more</span>
                </div>
                <div className="flex items-center text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Confident about future earnings</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-xl">
                <p className="text-green-900 font-medium italic">
                  "Now I make data-driven decisions. My income increased by 40% in just one year!"
                </p>
                <p className="text-green-700 text-sm mt-2">- Rajesh Kumar, Punjab (1 year later)</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            Transform Your Farm Today
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-gray-600">Join 15,000+ farmers who've already made the switch</p>
        </div>
      </div>
    </section>
  )
}