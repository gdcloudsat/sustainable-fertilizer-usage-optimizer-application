import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { soilService, recommendationService } from '../services/api'
import SoilHealthCard from '../components/SoilHealthCard'
import SustainabilityScore from '../components/SustainabilityScore'
import { Sprout, ClipboardList, TrendingUp, Leaf, ArrowRight } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [recentSoil, setRecentSoil] = useState(null)
  const [recentRecommendation, setRecentRecommendation] = useState(null)
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    averageSustainabilityScore: 0,
    totalSavings: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [soils, recommendations] = await Promise.all([
        soilService.getAll(),
        recommendationService.getAll()
      ])

      if (soils.length > 0) {
        setRecentSoil(soils[0])
      }

      if (recommendations.length > 0) {
        setRecentRecommendation(recommendations[0])
        
        // Calculate stats
        const avgSustainability = recommendations.reduce((sum, r) => 
          sum + (r.sustainabilityMetrics?.overallSustainabilityScore || 0), 0
        ) / recommendations.length

        setStats({
          totalRecommendations: recommendations.length,
          averageSustainabilityScore: Math.round(avgSustainability * 10) / 10,
          totalSavings: recommendations.reduce((sum, r) => 
            sum + (r.profitEstimate || 0), 0
          )
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-earth-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-earth-600 mt-1">
            Here's what's happening with your farm optimization
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link to="/soil-input" className="btn-primary">
            <Sprout className="h-4 w-4 mr-2" />
            Add Soil Data
          </Link>
          <Link to="/recommendations" className="btn-outline">
            <ClipboardList className="h-4 w-4 mr-2" />
            New Recommendation
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <ClipboardList className="h-5 w-5 text-primary-100" />
            <span className="text-primary-100">Total Recommendations</span>
          </div>
          <p className="text-4xl font-bold">{stats.totalRecommendations}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Leaf className="h-5 w-5 text-green-100" />
            <span className="text-green-100">Avg. Sustainability Score</span>
          </div>
          <p className="text-4xl font-bold">{stats.averageSustainabilityScore || 'N/A'}</p>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-100" />
            <span className="text-blue-100">Total Profit Estimate</span>
          </div>
          <p className="text-4xl font-bold">
            ${stats.totalSavings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Soil Data */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-earth-900">Recent Soil Data</h2>
            <Link to="/soil-input" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {recentSoil ? (
            <SoilHealthCard soil={recentSoil} />
          ) : (
            <div className="card text-center py-12">
              <Sprout className="h-12 w-12 text-earth-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-earth-700 mb-2">No Soil Data Yet</h3>
              <p className="text-earth-500 mb-4">Add your first soil test to get started</p>
              <Link to="/soil-input" className="btn-primary">
                Add Soil Data
              </Link>
            </div>
          )}
        </div>

        {/* Recent Recommendation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-earth-900">Latest Recommendation</h2>
            <Link to="/history" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View History <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {recentRecommendation ? (
            <SustainabilityScore 
              score={recentRecommendation.sustainabilityMetrics?.overallSustainabilityScore || 0}
              metrics={recentRecommendation.sustainabilityMetrics}
            />
          ) : (
            <div className="card text-center py-12">
              <ClipboardList className="h-12 w-12 text-earth-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-earth-700 mb-2">No Recommendations Yet</h3>
              <p className="text-earth-500 mb-4">Generate your first fertilizer recommendation</p>
              <Link to="/recommendations" className="btn-primary">
                Get Recommendation
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-earth-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/soil-input" className="flex items-center p-4 bg-earth-50 rounded-lg hover:bg-earth-100 transition-colors">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <Sprout className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-earth-900">Add Soil Data</p>
              <p className="text-sm text-earth-500">Input test results</p>
            </div>
          </Link>

          <Link to="/crop-selection" className="flex items-center p-4 bg-earth-50 rounded-lg hover:bg-earth-100 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Leaf className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-earth-900">Select Crops</p>
              <p className="text-sm text-earth-500">Choose what to grow</p>
            </div>
          </Link>

          <Link to="/recommendations" className="flex items-center p-4 bg-earth-50 rounded-lg hover:bg-earth-100 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-earth-900">Get Recommendation</p>
              <p className="text-sm text-earth-500">Optimize fertilizer</p>
            </div>
          </Link>

          <Link to="/history" className="flex items-center p-4 bg-earth-50 rounded-lg hover:bg-earth-100 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-earth-900">View History</p>
              <p className="text-sm text-earth-500">Past recommendations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
