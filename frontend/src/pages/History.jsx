import React, { useState, useEffect } from 'react'
import { recommendationService } from '../services/api'
import SustainabilityScore from '../components/SustainabilityScore'
import { History, Calendar, DollarSign, Sprout, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const RecommendationHistory = () => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const data = await recommendationService.getAll()
      setRecommendations(data)
    } catch (error) {
      toast.error('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recommendation?')) return

    try {
      await recommendationService.delete(id)
      toast.success('Recommendation deleted')
      fetchRecommendations()
    } catch (error) {
      toast.error('Failed to delete recommendation')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-earth-100 text-earth-700',
      active: 'bg-blue-100 text-blue-700',
      applied: 'bg-green-100 text-green-700',
      completed: 'bg-purple-100 text-purple-700'
    }
    return colors[status] || 'bg-earth-100 text-earth-700'
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
      {/* Header */}
      <div>
        <h1 className="section-title">Recommendation History</h1>
        <p className="section-subtitle">
          View and manage all your fertilizer recommendations
        </p>
      </div>

      {/* Stats Summary */}
      {recommendations.length > 0 && (
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card">
            <p className="text-earth-500 text-sm">Total Recommendations</p>
            <p className="text-3xl font-bold text-earth-900">{recommendations.length}</p>
          </div>
          <div className="card">
            <p className="text-earth-500 text-sm">Total Investment</p>
            <p className="text-3xl font-bold text-earth-900">
              ${recommendations.reduce((sum, r) => sum + (r.totalCost || 0), 0).toFixed(0)}
            </p>
          </div>
          <div className="card">
            <p className="text-earth-500 text-sm">Total Profit Estimate</p>
            <p className="text-3xl font-bold text-green-600">
              ${recommendations.reduce((sum, r) => sum + (r.profitEstimate || 0), 0).toFixed(0)}
            </p>
          </div>
          <div className="card">
            <p className="text-earth-500 text-sm">Avg. Sustainability</p>
            <p className="text-3xl font-bold text-primary-600">
              {(recommendations.reduce((sum, r) => sum + (r.sustainabilityMetrics?.overallSustainabilityScore || 0), 0) / recommendations.length).toFixed(0)}
            </p>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="card text-center py-12">
            <History className="h-12 w-12 text-earth-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-earth-700 mb-2">No Recommendations Yet</h3>
            <p className="text-earth-500">Generate your first recommendation to see it here</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div key={rec._id} className="card">
              {/* Header Row */}
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === rec._id ? null : rec._id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <Sprout className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth-900">
                      {rec.cropId?.name || 'Unknown Crop'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-earth-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(rec.generatedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${rec.totalCost?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rec.status)}`}>
                    {rec.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(rec._id)
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  {expandedId === rec._id ? (
                    <ChevronUp className="h-5 w-5 text-earth-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-earth-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === rec._id && (
                <div className="mt-6 pt-6 border-t border-earth-200">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Fertilizer Details */}
                    <div>
                      <h4 className="font-semibold text-earth-900 mb-4">Recommended Fertilizers</h4>
                      <div className="space-y-3">
                        {rec.recommendations?.map((fert, idx) => (
                          <div key={idx} className="p-3 bg-earth-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{fert.fertilizer?.name}</span>
                              <span className="text-primary-600 font-semibold">
                                ${fert.cost?.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-earth-500">
                              {fert.quantity} {fert.unit} • {fert.applicationMethod}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Soil Summary */}
                      {rec.soilId && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">Soil Data</h5>
                          <p className="text-sm text-blue-800">
                            pH: {rec.soilId.phLevel} • N: {rec.soilId.nitrogen} • 
                            P: {rec.soilId.phosphorus} • K: {rec.soilId.potassium}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Sustainability Metrics */}
                    <SustainabilityScore
                      score={rec.sustainabilityMetrics?.overallSustainabilityScore || 0}
                      metrics={rec.sustainabilityMetrics}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <select
                      value={rec.status}
                      onChange={(e) => {
                        recommendationService.updateStatus(rec._id, e.target.value)
                          .then(() => {
                            toast.success('Status updated')
                            fetchRecommendations()
                          })
                      }}
                      className="input w-32"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="applied">Applied</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecommendationHistory
