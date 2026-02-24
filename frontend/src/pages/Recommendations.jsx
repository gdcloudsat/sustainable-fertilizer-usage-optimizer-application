import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { soilService, cropService, recommendationService, weatherService } from '../services/api'
import SustainabilityScore from '../components/SustainabilityScore'
import { Beaker, Sprout, CloudSun, Calculator, ArrowRight, CheckCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

const Recommendations = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [soilTests, setSoilTests] = useState([])
  const [crops, setCrops] = useState([])
  const [selectedSoil, setSelectedSoil] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [farmSize, setFarmSize] = useState(1)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [recommendation, setRecommendation] = useState(null)

  useEffect(() => {
    fetchData()
    
    // Check if crop was pre-selected from crop selection page
    if (location.state?.selectedCrop) {
      setSelectedCrop(location.state.selectedCrop._id)
    }
  }, [location.state])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [soils, cropsData] = await Promise.all([
        soilService.getAll(),
        cropService.getAll()
      ])
      setSoilTests(soils)
      setCrops(cropsData)
      
      if (soils.length > 0 && !selectedSoil) {
        setSelectedSoil(soils[0]._id)
      }
      
      // Get weather data (using default coordinates)
      try {
        const weather = await weatherService.getCurrent(40.7128, -74.0060)
        setWeatherData(weather)
      } catch (e) {
        console.log('Weather data unavailable')
      }
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedSoil || !selectedCrop) {
      toast.error('Please select both soil and crop')
      return
    }

    setGenerating(true)
    try {
      const data = await recommendationService.generate({
        soilId: selectedSoil,
        cropId: selectedCrop,
        farmSize,
        weatherData
      })
      setRecommendation(data)
      toast.success('Recommendation generated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate recommendation')
    } finally {
      setGenerating(false)
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
      {/* Header */}
      <div>
        <h1 className="section-title">Generate Recommendation</h1>
        <p className="section-subtitle">
          Select your soil data and crop to get personalized fertilizer recommendations
        </p>
      </div>

      {/* Input Form */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Calculator className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-earth-900">Input Parameters</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="label">Select Soil Test</label>
            <select
              value={selectedSoil}
              onChange={(e) => setSelectedSoil(e.target.value)}
              className="input"
            >
              <option value="">Choose soil data...</option>
              {soilTests.map(soil => (
                <option key={soil._id} value={soil._id}>
                  {new Date(soil.testDate).toLocaleDateString()} - pH {soil.phLevel}
                </option>
              ))}
            </select>
            {soilTests.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                <a href="/soil-input" className="underline">Add soil data first</a>
              </p>
            )}
          </div>

          <div>
            <label className="label">Select Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="input"
            >
              <option value="">Choose crop...</option>
              {crops.map(crop => (
                <option key={crop._id} value={crop._id}>
                  {crop.name} ({crop.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Farm Size (acres)</label>
            <input
              type="number"
              value={farmSize}
              onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
              min="0.1"
              step="0.1"
              className="input"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={generating || !selectedSoil || !selectedCrop}
              className="btn-primary w-full"
            >
              {generating ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Weather Info */}
        {weatherData && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CloudSun className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Weather Considerations</span>
            </div>
            <p className="text-sm text-blue-800">
              {weatherData.forecast?.recommendation || 'Weather data loaded for recommendations'}
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {recommendation && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <p className="text-blue-100 text-sm">Total Cost</p>
              <p className="text-3xl font-bold">${recommendation.totalCost?.toFixed(2)}</p>
            </div>
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <p className="text-green-100 text-sm">Expected Yield</p>
              <p className="text-3xl font-bold">{recommendation.expectedYield?.value?.toFixed(0)} {recommendation.expectedYield?.unit}</p>
            </div>
            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <p className="text-purple-100 text-sm">Est. Revenue</p>
              <p className="text-3xl font-bold">${recommendation.estimatedRevenue?.toFixed(0)}</p>
            </div>
            <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <p className="text-primary-100 text-sm">Est. Profit</p>
              <p className="text-3xl font-bold">${recommendation.profitEstimate?.toFixed(0)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Fertilizer Recommendations */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-6">
                <Beaker className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-earth-900">Recommended Fertilizers</h2>
              </div>

              <div className="space-y-4">
                {recommendation.recommendations?.map((rec, index) => (
                  <div key={index} className="p-4 bg-earth-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-earth-900">
                          {rec.fertilizer?.name || 'Fertilizer'}
                        </h4>
                        <p className="text-sm text-earth-500">
                          {rec.fertilizer?.type} • {rec.fertilizer?.npkRatio}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        ${rec.cost?.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-earth-500">Quantity:</span>
                        <p className="font-medium">{rec.quantity} {rec.unit}</p>
                      </div>
                      <div>
                        <span className="text-earth-500">Timing:</span>
                        <p className="font-medium">{rec.applicationTiming}</p>
                      </div>
                      <div>
                        <span className="text-earth-500">Method:</span>
                        <p className="font-medium">{rec.applicationMethod}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {recommendation.notes && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Note:</span> {recommendation.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Sustainability Score */}
            <SustainabilityScore
              score={recommendation.sustainabilityMetrics?.overallSustainabilityScore || 0}
              metrics={recommendation.sustainabilityMetrics}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/history')}
              className="btn-secondary"
            >
              View All Recommendations
            </button>
            <button
              onClick={() => {
                setRecommendation(null)
                setSelectedSoil('')
                setSelectedCrop('')
              }}
              className="btn-outline"
            >
              Generate Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Recommendations
