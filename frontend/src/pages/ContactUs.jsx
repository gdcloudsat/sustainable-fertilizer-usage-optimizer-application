import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    toast.success('Thank you! Your message has been sent successfully.')
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@ecofertilizer.com', 'info@ecofertilizer.com']
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543']
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Green Valley Road', 'Agricultural District, CA 90210']
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8AM - 6PM', 'Saturday: 9AM - 2PM']
    }
  ]

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="card text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Message Sent Successfully!</h2>
          <p className="text-earth-600 mb-8">
            Thank you for reaching out, {formData.name}. We have received your message and will get back to you 
            at {formData.email} within 24 hours.
          </p>
          <button 
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
            }}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <section className="text-center py-12">
        <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <MessageSquare className="h-4 w-4" />
          <span>Get In Touch</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-earth-900 mb-6">
          Contact <span className="text-gradient">EcoFertilizer</span>
        </h1>
        
        <p className="text-xl text-earth-600 max-w-2xl mx-auto">
          Have questions about our platform? Need help optimizing your fertilizer usage? 
          We are here to help you succeed.
        </p>
      </section>

      <div className="grid lg:grid-cols-3 gap-8 py-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="card">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl flex-shrink-0">
                    <info.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth-900 mb-1">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-earth-600 text-sm">{detail}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="card mt-4 bg-earth-100 border-dashed border-2 border-earth-300">
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-earth-400 mx-auto mb-2" />
                <p className="text-earth-500 text-sm">Interactive Map</p>
                <p className="text-earth-400 text-xs">123 Green Valley Road</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold text-earth-900 mb-2">Send Us a Message</h2>
            <p className="text-earth-600 mb-6">
              Fill out the form below and we will get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="label">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="label">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="label">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="input resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <div className="flex items-center space-x-2 text-sm text-earth-600">
                <input
                  type="checkbox"
                  id="privacy"
                  className="rounded border-earth-300 text-primary-600 focus:ring-primary-500"
                  required
                />
                <label htmlFor="privacy">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                  {' '}and processing of my personal data.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full md:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FAQ Teaser */}
          <div className="mt-8 card bg-primary-50 border-primary-200">
            <div className="flex items-start space-x-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-earth-900 mb-1">Looking for quick answers?</h3>
                <p className="text-earth-600 text-sm mb-3">
                  Check out our comprehensive FAQ section for answers to common questions about 
                  soil testing, fertilizer recommendations, and account management.
                </p>
                <a href="#" className="text-primary-600 font-medium hover:underline text-sm">
                  View Frequently Asked Questions →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
