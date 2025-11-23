import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { 
  Target,
  Users,
  Award,
  Heart,
  MapPin,
  Calendar,
  ArrowRight,
  Linkedin
} from 'lucide-react'

const team = [
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Founder & CEO',
    image: '/placeholder-user.jpg',
    bio: 'Former IIT professor with 15 years in AgTech. Led precision farming initiatives across 5 states.',
    linkedin: '#'
  },
  {
    name: 'Priya Sharma',
    role: 'Head of AI Research',
    image: '/placeholder-user.jpg',
    bio: 'PhD in Machine Learning from Stanford. Previously AI Lead at John Deere for crop intelligence.',
    linkedin: '#'
  },
  {
    name: 'Amit Patel',
    role: 'Head of Farmer Relations',
    image: '/placeholder-user.jpg',
    bio: 'Third-generation farmer from Gujarat. Bridge between technology and traditional farming wisdom.',
    linkedin: '#'
  },
  {
    name: 'Dr. Sneha Reddy',
    role: 'Chief Technology Officer',
    image: '/placeholder-user.jpg',
    bio: 'Former Microsoft Principal Engineer. Expert in scalable agricultural data systems.',
    linkedin: '#'
  }
]

const milestones = [
  {
    year: '2022',
    title: 'KrishiChakra Founded',
    description: 'Started with a vision to democratize precision farming for Indian farmers'
  },
  {
    year: '2023',
    title: 'First 1,000 Farmers',
    description: 'Successfully onboarded our first farming community in Punjab and Haryana'
  },
  {
    year: '2024',
    title: 'AI Platform Launch',
    description: 'Launched comprehensive AI platform with crop health detection and yield prediction'
  },
  {
    year: '2025',
    title: '15,000+ Active Users',
    description: 'Expanded across 12 states with ₹500CR+ revenue generated for farmers'
  }
]

const values = [
  {
    icon: Heart,
    title: 'Farmer-First Approach',
    description: 'Every decision we make prioritizes the success and well-being of farmers'
  },
  {
    icon: Target,
    title: 'Innovation with Purpose',
    description: 'We develop technology that solves real farming challenges, not just for the sake of innovation'
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'Creating a network where farmers learn from each other and grow together'
  },
  {
    icon: Award,
    title: 'Excellence in Execution',
    description: 'Delivering reliable, accurate, and user-friendly solutions that farmers can depend on'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2 font-medium mb-6">
              <Heart className="w-4 h-4 mr-2" />
              Our Story
            </Badge>
            
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Empowering India's Farmers with
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent block mt-2">
                AI-Driven Agriculture
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded by farmers and technologists, KrishiChakra bridges the gap between traditional farming wisdom and cutting-edge AI technology to create sustainable prosperity for Indian agriculture.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                To democratize precision agriculture by making advanced AI tools accessible, affordable, and practical for every Indian farmer. We believe that technology should serve farmers, not the other way around.
              </p>
              
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-bold text-green-900 mb-3">Our Vision for 2030</h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>1 million farmers using AI-powered farming</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>50% reduction in crop losses across India</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>₹10,000CR+ additional income for farmers</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-600 mb-4">15K+</div>
                  <div className="text-xl text-green-800 font-semibold">Farmers Empowered</div>
                  <div className="text-green-600 mt-2">Across 12 Indian States</div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Made in India</div>
                    <div className="text-sm text-gray-600">Built for Indian Agriculture</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gradient-to-r from-slate-50 to-green-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every feature we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A passionate team of farmers, technologists, and researchers working together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-2 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-green-600 font-semibold mb-4">{member.role}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Linkedin className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">
              From a simple idea to empowering thousands of farmers across India
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-green-100 mb-10">
            Be part of the agricultural revolution that's transforming farming in India
          </p>
          
          <Button 
            size="lg" 
            className="bg-white text-green-600 hover:bg-gray-50 px-12 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}