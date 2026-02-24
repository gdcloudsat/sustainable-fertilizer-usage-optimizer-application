import React from 'react'
import { Leaf, Droplets, Wind, Sun } from 'lucide-react'

const SustainabilityScore = ({ score, metrics }) => {
  const getScoreColor = (s) => {
    if (s >= 80) return 'text-green-600'
    if (s >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (s) => {
    if (s >= 80) return 'bg-green-100'
    if (s >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Leaf className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-earth-900">Sustainability Metrics</h3>
      </div>

      {/* Overall Score */}
      <div className="flex items-center justify-center mb-6">
        <div className={`${getScoreBg(score)} rounded-full p-8`}>
          <div className="text-center">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <p className="text-sm text-earth-600 mt-1">Overall Score</p>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-earth-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-earth-600">N Efficiency</span>
            </div>
            <p className="text-lg font-semibold text-earth-900">
              {metrics.nitrogenUseEfficiency}%
            </p>
          </div>

          <div className="bg-earth-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Droplets className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-earth-600">P Efficiency</span>
            </div>
            <p className="text-lg font-semibold text-earth-900">
              {metrics.phosphorusUseEfficiency}%
            </p>
          </div>

          <div className="bg-earth-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Droplets className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-earth-600">K Efficiency</span>
            </div>
            <p className="text-lg font-semibold text-earth-900">
              {metrics.potassiumUseEfficiency}%
            </p>
          </div>

          <div className="bg-earth-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Wind className="h-4 w-4 text-teal-500" />
              <span className="text-sm text-earth-600">Carbon Reduction</span>
            </div>
            <p className="text-lg font-semibold text-earth-900">
              {metrics.carbonFootprintReduction}%
            </p>
          </div>

          <div className="bg-earth-50 rounded-lg p-3 col-span-2">
            <div className="flex items-center space-x-2 mb-1">
              <Sun className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-earth-600">Soil Health Score</span>
            </div>
            <p className="text-lg font-semibold text-earth-900">
              {metrics.soilHealthScore}/100
            </p>
          </div>
        </div>
      )}

      {/* Water Quality Impact */}
      {metrics?.waterQualityImpact && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Water Quality Impact:</span>{' '}
            {metrics.waterQualityImpact.charAt(0).toUpperCase() + metrics.waterQualityImpact.slice(1)} risk of water pollution
          </p>
        </div>
      )}
    </div>
  )
}

export default SustainabilityScore
