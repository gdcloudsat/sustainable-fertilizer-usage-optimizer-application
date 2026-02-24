import React from 'react'
import { Beaker, Droplet, Thermometer, Wind } from 'lucide-react'

const SoilHealthCard = ({ soil }) => {
  const getPhColor = (ph) => {
    if (ph < 5.5) return 'text-red-600 bg-red-50'
    if (ph > 7.5) return 'text-orange-600 bg-orange-50'
    return 'text-green-600 bg-green-50'
  }

  const getNutrientStatus = (value, type) => {
    const thresholds = {
      nitrogen: { low: 20, high: 50 },
      phosphorus: { low: 15, high: 40 },
      potassium: { low: 100, high: 200 }
    }
    const t = thresholds[type]
    if (value < t.low) return { color: 'text-red-600', label: 'Deficient' }
    if (value > t.high) return { color: 'text-orange-600', label: 'High' }
    return { color: 'text-green-600', label: 'Adequate' }
  }

  const nStatus = getNutrientStatus(soil.nitrogen, 'nitrogen')
  const pStatus = getNutrientStatus(soil.phosphorus, 'phosphorus')
  const kStatus = getNutrientStatus(soil.potassium, 'potassium')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Beaker className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-earth-900">Soil Health</h3>
        </div>
        <span className="text-sm text-earth-500">
          {new Date(soil.testDate).toLocaleDateString()}
        </span>
      </div>

      {/* pH Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-earth-600">pH Level</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPhColor(soil.phLevel)}`}>
            {soil.phLevel < 5.5 ? 'Acidic' : soil.phLevel > 7.5 ? 'Alkaline' : 'Optimal'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Thermometer className="h-4 w-4 text-earth-400" />
          <div className="flex-1 bg-earth-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${(soil.phLevel / 14) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-earth-700">{soil.phLevel}</span>
        </div>
      </div>

      {/* Nutrients Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-earth-50 rounded-lg p-3">
          <div className="flex items-center space-x-1 mb-1">
            <Droplet className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-earth-500">Nitrogen</span>
          </div>
          <p className="text-lg font-semibold text-earth-900">{soil.nitrogen}</p>
          <p className={`text-xs ${nStatus.color}`}>{nStatus.label}</p>
        </div>

        <div className="bg-earth-50 rounded-lg p-3">
          <div className="flex items-center space-x-1 mb-1">
            <Droplet className="h-3 w-3 text-orange-500" />
            <span className="text-xs text-earth-500">Phosphorus</span>
          </div>
          <p className="text-lg font-semibold text-earth-900">{soil.phosphorus}</p>
          <p className={`text-xs ${pStatus.color}`}>{pStatus.label}</p>
        </div>

        <div className="bg-earth-50 rounded-lg p-3">
          <div className="flex items-center space-x-1 mb-1">
            <Droplet className="h-3 w-3 text-purple-500" />
            <span className="text-xs text-earth-500">Potassium</span>
          </div>
          <p className="text-lg font-semibold text-earth-900">{soil.potassium}</p>
          <p className={`text-xs ${kStatus.color}`}>{kStatus.label}</p>
        </div>
      </div>

      {/* Additional Info */}
      {(soil.organicMatter || soil.moistureContent) && (
        <div className="mt-4 pt-4 border-t border-earth-200">
          <div className="flex items-center space-x-2 text-sm text-earth-600">
            <Wind className="h-4 w-4" />
            {soil.organicMatter && (
              <span>Organic Matter: {soil.organicMatter}%</span>
            )}
            {soil.moistureContent && (
              <span>• Moisture: {soil.moistureContent}%</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SoilHealthCard
