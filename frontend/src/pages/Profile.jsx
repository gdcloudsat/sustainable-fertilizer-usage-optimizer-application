import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import { User, Mail, MapPin, Ruler, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    farmLocation: user?.farmLocation || '',
    farmSize: user?.farmSize || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'farmSize' ? parseFloat(value) || '' : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authService.updateProfile(formData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
          <User className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-earth-900">Your Profile</h1>
        <p className="text-earth-600">Manage your account and farm information</p>
      </div>

      {/* Profile Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
              <input
                type="email"
                value={user?.email}
                disabled
                className="input pl-10 bg-earth-100 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-earth-500 mt-1">Email cannot be changed</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">Farm Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
                <input
                  type="text"
                  name="farmLocation"
                  value={formData.farmLocation}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label className="label">Farm Size (acres)</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
                <input
                  type="number"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="input pl-10"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={logout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="card mt-6">
        <h3 className="font-semibold text-earth-900 mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-earth-500">Member Since</span>
            <span className="text-earth-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-earth-500">Account Type</span>
            <span className="text-earth-900">Farmer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-earth-500">Status</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
