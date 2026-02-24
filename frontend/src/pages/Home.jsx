import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Sprout, BarChart3, CloudSun, ArrowRight, CheckCircle } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Sprout,
      title: 'Soil Analysis',
      description: 'Input your soil test data for personalized nutrient recommendations.'
    },
    {
      icon: BarChart3,
      title: 'Smart Recommendations',
      description: 'Get AI-powered fertilizer suggestions based on crop needs and soil health.'
    },
    {
      icon: Leaf,
      title: 'Sustainability Focus',
      description: 'Optimize for environmental impact while maximizing crop yield and profit.'
    },
    {
      icon: CloudSun,
      title: 'Weather Integration',
      description: 'Factor in weather patterns for optimal application timing.'
    }
  ]

  const benefits = [
    'Reduce fertilizer costs by up to 25%',
    'Improve crop yields through optimized nutrition',
    'Minimize environmental impact',
    'Increase long-term soil health',
    'Maximize farmer profitability',
    'Sustainable farming practices'
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="h-4 w-4" />
            <span>Sustainable Agriculture Made Simple</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-earth-900 mb-6 leading-tight">
            Optimize Your Fertilizer Usage for{' '}
            <span className="text-gradient">Sustainable Farming</span>
          </h1>
          
          <p className="text-xl text-earth-600 mb-8 max-w-2xl mx-auto">
            Get personalized fertilizer recommendations based on your soil health, 
            crop type, and local weather. Boost yields while protecting the environment.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Start Optimizing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/login" className="btn-outline text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Our intelligent system analyzes multiple factors to provide optimal recommendations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-earth-900 mb-2">{feature.title}</h3>
                <p className="text-earth-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Why Choose EcoFertilizer?</h2>
              <p className="section-subtitle">
                Join thousands of farmers who are improving their yields while protecting the planet.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <span className="text-earth-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">By The Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-4xl font-bold mb-1">25%</p>
                  <p className="text-primary-100">Average Cost Reduction</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-1">15%</p>
                  <p className="text-primary-100">Yield Increase</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-1">30%</p>
                  <p className="text-primary-100">Less Environmental Impact</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-1">1000+</p>
                  <p className="text-primary-100">Farmers Helped</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center bg-earth-800 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Farm?
          </h2>
          <p className="text-earth-300 mb-8 max-w-2xl mx-auto">
            Start your journey towards sustainable, profitable farming today. 
            Create your free account and get your first recommendation.
          </p>
          <Link to="/register" className="inline-flex items-center px-8 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
