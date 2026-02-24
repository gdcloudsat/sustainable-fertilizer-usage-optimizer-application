import React from 'react'
import { Leaf, Target, Heart, Globe, Users, Award, Sprout, TrendingUp } from 'lucide-react'

const AboutUs = () => {
  const values = [
    {
      icon: Sprout,
      title: 'Sustainability First',
      description: 'We believe in farming practices that protect our planet for future generations while maintaining profitable operations today.'
    },
    {
      icon: Target,
      title: 'Precision Agriculture',
      description: 'Data-driven decisions lead to better outcomes. We empower farmers with accurate, actionable insights.'
    },
    {
      icon: Heart,
      title: 'Farmer Success',
      description: 'Every feature we build is designed with farmers in mind, focusing on practical solutions to real challenges.'
    },
    {
      icon: Globe,
      title: 'Environmental Impact',
      description: 'Reducing chemical runoff and optimizing resource use protects waterways and ecosystems worldwide.'
    }
  ]

  const stats = [
    { value: '1000+', label: 'Farmers Helped' },
    { value: '25%', label: 'Average Cost Savings' },
    { value: '15%', label: 'Yield Increase' },
    { value: '50K+', label: 'Acres Optimized' }
  ]

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Agricultural Scientist',
      bio: 'PhD in Soil Science with 15 years of experience in sustainable farming practices.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Lead Developer',
      bio: 'Full-stack engineer passionate about building technology that makes a difference.'
    },
    {
      name: 'Emily Watson',
      role: 'Product Manager',
      bio: 'Former farmer who understands the real-world challenges of modern agriculture.'
    },
    {
      name: 'Dr. James Kim',
      role: 'Data Scientist',
      bio: 'Expert in machine learning applications for agricultural optimization.'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Leaf className="h-4 w-4" />
          <span>Our Mission</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-earth-900 mb-6">
          Empowering Farmers for a{' '}
          <span className="text-gradient">Sustainable Future</span>
        </h1>
        
        <p className="text-xl text-earth-600 max-w-3xl mx-auto">
          EcoFertilizer was founded with a simple yet powerful mission: to help farmers 
          optimize their fertilizer usage for better yields, lower costs, and a healthier planet.
        </p>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white rounded-3xl mb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Our Story</h2>
              <div className="space-y-4 text-earth-600">
                <p>
                  It all started when our founder, a third-generation farmer, witnessed firsthand 
                  the environmental impact of over-fertilization. Lake algae blooms, soil degradation, 
                  and rising costs were becoming increasingly common problems.
                </p>
                <p>
                  In 2020, we assembled a team of agricultural experts, data scientists, and software 
                  engineers to build a solution. After two years of research and development, 
                  EcoFertilizer was born.
                </p>
                <p>
                  Today, we serve thousands of farmers across the country, helping them make 
                  data-driven decisions that benefit their bottom line and the environment.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                    <p className="text-primary-100 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            These principles guide everything we do, from product development to customer support
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="card text-center group hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-4 group-hover:bg-primary-200 transition-colors">
                <value.icon className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-earth-900 mb-2">{value.title}</h3>
              <p className="text-earth-600 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Passionate experts dedicated to revolutionizing sustainable agriculture
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="card text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-earth-900">{member.name}</h3>
              <p className="text-primary-600 text-sm font-medium mb-2">{member.role}</p>
              <p className="text-earth-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-earth-800 rounded-3xl text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-earth-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="h-4 w-4" />
            <span>Recognition</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-8">Awards & Recognition</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <TrendingUp className="h-10 w-10 text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">AgTech Innovation Award 2023</h3>
              <p className="text-earth-300 text-sm">Recognized for excellence in agricultural technology</p>
            </div>
            <div>
              <Leaf className="h-10 w-10 text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Green Tech Certificate</h3>
              <p className="text-earth-300 text-sm">Certified sustainable technology solution</p>
            </div>
            <div>
              <Users className="h-10 w-10 text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Farmer's Choice Award</h3>
              <p className="text-earth-300 text-sm">Voted #1 fertilizer optimization tool</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
