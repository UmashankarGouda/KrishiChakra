import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Users,
  HeadphonesIcon,
  Send
} from 'lucide-react'

const contactMethods = [
  {
    icon: Phone,
    title: '24/7 Farmer Helpline',
    details: '+91-1800-KRISHI (1800-574-744)',
    description: 'Toll-free support in Hindi, English, and regional languages',
    available: 'Available 24/7'
  },
  {
    icon: Mail,
    title: 'Email Support',
    details: 'support@krishichakra.com',
    description: 'Get detailed responses within 4 hours',
    available: 'Response within 4 hours'
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Support',
    details: '+91-98765-43210',
    description: 'Quick answers and photo-based crop consultation',
    available: '6 AM - 10 PM IST'
  },
  {
    icon: Users,
    title: 'Field Representative',
    details: 'Book a visit',
    description: 'In-person support at your farm location',
    available: 'Available in 200+ districts'
  }
]

const offices = [
  {
    city: 'Bangalore (Headquarters)',
    address: 'KrishiChakra Technologies Pvt Ltd\nKoramangala, Bangalore - 560034\nKarnataka, India',
    phone: '+91-80-4567-8900',
    email: 'bangalore@krishichakra.com'
  },
  {
    city: 'Delhi (North Region)',
    address: 'Connaught Place\nNew Delhi - 110001\nDelhi, India',
    phone: '+91-11-4567-8900',
    email: 'delhi@krishichakra.com'
  },
  {
    city: 'Pune (West Region)',
    address: 'Baner IT Park\nPune - 411045\nMaharashtra, India',
    phone: '+91-20-4567-8900',
    email: 'pune@krishichakra.com'
  }
]

const faqs = [
  {
    question: 'How quickly can I see results after joining KrishiChakra?',
    answer: 'Most farmers see improvements in their first growing season. Immediate benefits include better crop monitoring and weather alerts, while yield improvements typically show in 3-6 months.'
  },
  {
    question: 'Do I need internet connection to use the mobile app?',
    answer: 'The app works offline for basic features like crop health scanning. Data syncs automatically when you have internet connection. Critical alerts are sent via SMS when offline.'
  },
  {
    question: 'Is KrishiChakra suitable for small farmers?',
    answer: 'Absolutely! We have plans starting from ₹99/month for small farms. Our Starter plan is designed specifically for farmers with 1-10 acres of land.'
  },
  {
    question: 'What languages is the platform available in?',
    answer: 'KrishiChakra is available in Hindi, English, and 8 regional languages including Punjabi, Gujarati, Marathi, Telugu, Tamil, Kannada, Bengali, and Odia.'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2 font-medium mb-6">
              <HeadphonesIcon className="w-4 h-4 mr-2" />
              24/7 Support
            </Badge>
            
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              We're Here to
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent block mt-2">
                Help You Succeed
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get expert support from our team of agricultural specialists and technical experts. We're committed to your farming success.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Multiple Ways to Reach Us</h2>
            <p className="text-xl text-gray-600">Choose the method that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <method.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <div className="text-green-600 font-semibold mb-3">{method.details}</div>
                <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  {method.available}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Info */}
      <section className="py-24 bg-gradient-to-r from-slate-50 to-green-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h3>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 4 hours</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input placeholder="Enter your full name" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input placeholder="Enter your phone number" className="rounded-xl" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input type="email" placeholder="Enter your email address" className="rounded-xl" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location</label>
                  <Input placeholder="Village, District, State" className="rounded-xl" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>Select farm size</option>
                    <option>Less than 1 acre</option>
                    <option>1-5 acres</option>
                    <option>5-10 acres</option>
                    <option>10-50 acres</option>
                    <option>More than 50 acres</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How can we help you?</label>
                  <Textarea 
                    placeholder="Tell us about your farming challenges or questions about KrishiChakra"
                    className="rounded-xl min-h-[120px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Office Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Offices</h3>
                <p className="text-gray-600 mb-8">Visit us at any of our locations across India</p>
              </div>

              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{office.city}</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                        <div className="text-gray-600 whitespace-pre-line">{office.address}</div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-green-600 mr-3" />
                        <div className="text-gray-600">{office.phone}</div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-green-600 mr-3" />
                        <div className="text-gray-600">{office.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-green-600 mr-3" />
                  <h4 className="text-xl font-bold text-green-900">Business Hours</h4>
                </div>
                <div className="space-y-2 text-green-800">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="text-sm font-medium text-green-700">
                      📞 Emergency Farmer Helpline: Available 24/7
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contact Support Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}