import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Eye, 
  Cloud, 
  BarChart3, 
  Smartphone, 
  Shield,
  TrendingUp,
  Zap,
  Target,
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Crop Recommendations',
    description: 'Advanced machine learning algorithms analyze your soil conditions, weather patterns, and market trends to provide personalized crop recommendations that maximize your profits.',
    benefits: ['35% average yield increase', 'Reduced fertilizer costs', 'Optimal planting schedules'],
    color: 'green'
  },
  {
    icon: Eye,
    title: 'Computer Vision Plant Health',
    description: 'Simply take photos of your crops with your smartphone. Our AI instantly identifies diseases, pests, and nutrient deficiencies with 95% accuracy.',
    benefits: ['Early disease detection', 'Precise treatment plans', 'Prevent crop losses up to 80%'],
    color: 'blue'
  },
  {
    icon: Cloud,
    title: 'Weather Intelligence System',
    description: 'Hyperlocal weather forecasts and alerts help you make critical farming decisions. Get 7-day predictions with farm-specific accuracy.',
    benefits: ['Micro-climate analysis', 'Irrigation optimization', 'Storm damage prevention'],
    color: 'purple'
  },
  {
    icon: BarChart3,
    title: 'Yield Prediction Analytics',
    description: 'Data-driven yield forecasting helps you plan harvest timing, storage needs, and market strategies months in advance.',
    benefits: ['96% prediction accuracy', 'Harvest planning', 'Revenue optimization'],
    color: 'emerald'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Platform',
    description: 'Access all features from your smartphone, even in remote areas. Works offline and syncs when connected.',
    benefits: ['Offline functionality', 'Real-time notifications', 'Field-ready interface'],
    color: 'orange'
  },
  {
    icon: Shield,
    title: 'Data Security & Privacy',
    description: 'Your farm data is encrypted and stored securely. We never share your information without permission.',
    benefits: ['Bank-level encryption', 'Local data storage', 'GDPR compliant'],
    color: 'red'
  }
]

const stats = [
  {
    icon: Users,
    value: '15,000+',
    label: 'Active Farmers',
    description: 'Trust KrishiChakra across India'
  },
  {
    icon: TrendingUp,
    value: '35%',
    label: 'Average Yield Increase',
    description: 'Proven results in first season'
  },
  {
    icon: Target,
    value: '₹500CR+',
    label: 'Revenue Generated',
    description: 'For our farming community'
  },
  {
    icon: Zap,
    value: '95%',
    label: 'Accuracy Rate',
    description: 'In crop health diagnosis'
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2 font-medium mb-6">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Agriculture
            </Badge>
            
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent block mt-2">
                Farm Smarter
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Discover how KrishiChakra's comprehensive suite of AI tools transforms traditional farming into precision agriculture, helping you increase yields while reducing costs.
            </p>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-3">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proven Results Across India
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of farmers who have transformed their operations with KrishiChakra
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-900 font-semibold mb-2">{stat.label}</div>
                <div className="text-gray-600 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-10">
            Join 15,000+ farmers who are already using AI to increase their profits
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-50 px-12 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Start Free 30-Day Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-green-600 px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}