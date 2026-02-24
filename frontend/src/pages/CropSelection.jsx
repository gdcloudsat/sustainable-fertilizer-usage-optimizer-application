import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cropService } from '../services/api'
import { Search, Leaf, Sprout, Sun, Droplets, Calendar, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const CropSelection = () => {
  const [crops, setCrops] = useState([])
  const [filteredCrops, setFilteredCrops] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCrops()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterCrops()
  }, [crops, selectedCategory, searchQuery])

  const fetchCrops = async () => {
    try {
      const data = await cropService.getAll()
      setCrops(data)
      setFilteredCrops(data)
    } catch (error) {
      toast.error('Failed to load crops')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await cropService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories')
    }
  }

  const filterCrops = () => {
    let filtered = crops

    if (selectedCategory) {
      filtered = filtered.filter(crop => crop.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredCrops(filtered)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'cereal': return Sprout
      case 'legume': return Leaf
      case 'vegetable': return Sun
      default: return Droplets
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      cereal: 'bg-yellow-100 text-yellow-800',
      legume: 'bg-green-100 text-green-800',
      vegetable: 'bg-orange-100 text-orange-800',
      fruit: 'bg-red-100 text-red-800',
      oilseed: 'bg-purple-100 text-purple-800',
      fiber: 'bg-blue-100 text-blue-800'
    }
    return colors[category] || 'bg-earth-100 text-earth-800'
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
        <h1 className="section-title">Select Your Crops</h1>
        <p className="section-subtitle">
          Choose crops to get personalized fertilizer recommendations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
            <input
              type="text"
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input md:w-48"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-primary-600 text-white'
                : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => {
          const CategoryIcon = getCategoryIcon(crop.category)
          
          return (
            <div
              key={crop._id}
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate('/recommendations', { state: { selectedCrop: crop } })}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${getCategoryColor(crop.category)}`}>
                  <CategoryIcon className="h-6 w-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(crop.category)}`}>
                  {crop.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-earth-900 mb-1">{crop.name}</h3>
              <p className="text-sm text-earth-500 italic mb-4">{crop.scientificName}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-earth-600">
                  <Calendar className="h-4 w-4 mr-2 text-earth-400" />
                  <span>{crop.daysToMaturity} days to maturity</span>
                </div>
                <div className="flex items-center text-earth-600">
                  <Sun className="h-4 w-4 mr-2 text-earth-400" />
                  <span>{crop.waterRequirement} water needs</span>
                </div>
                <div className="flex items-center text-earth-600">
                  <Sprout className="h-4 w-4 mr-2 text-earth-400" />
                  <span>{crop.growingSeason} growing season</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-earth-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-earth-500">Expected Yield</span>
                  <span className="font-medium text-earth-900">
                    {crop.expectedYield?.value} {crop.expectedYield?.unit}
                  </span>
                </div>
                {crop.marketPrice && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-earth-500">Market Price</span>
                    <span className="font-medium text-earth-900">
                      ${crop.marketPrice.value}/{crop.marketPrice.unit}
                    </span>
                  </div>
                )}
              </div>

              <button className="w-full mt-4 btn-outline text-sm py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Select Crop
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )
        })}
      </div>

      {filteredCrops.length === 0 && (
        <div className="card text-center py-12">
          <Leaf className="h-12 w-12 text-earth-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-earth-700 mb-2">No Crops Found</h3>
          <p className="text-earth-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default CropSelection
