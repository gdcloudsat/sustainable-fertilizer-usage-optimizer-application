import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const CropForm = ({ crop, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: 'cereal',
    nutrientRequirements: {
      nitrogen: 50,
      phosphorus: 30,
      potassium: 40,
      sulfur: 0,
      calcium: 0,
      magnesium: 0,
      micronutrients: []
    },
    optimalPh: {
      min: 6.0,
      max: 7.0
    },
    growingSeason: 'spring',
    daysToMaturity: 90,
    waterRequirement: 'moderate',
    climateSuitability: ['temperate'],
    soilPreferences: {
      texture: [],
      drainage: 'well-drained'
    },
    expectedYield: {
      value: 1000,
      unit: 'kg/acre'
    },
    marketPrice: {
      value: 0,
      currency: 'USD',
      unit: 'kg'
    },
    sustainabilityScore: 50
  });

  useEffect(() => {
    if (crop) {
      setFormData({
        name: crop.name || '',
        scientificName: crop.scientificName || '',
        category: crop.category || 'cereal',
        nutrientRequirements: crop.nutrientRequirements || {
          nitrogen: 50,
          phosphorus: 30,
          potassium: 40,
          sulfur: 0,
          calcium: 0,
          magnesium: 0,
          micronutrients: []
        },
        optimalPh: crop.optimalPh || {
          min: 6.0,
          max: 7.0
        },
        growingSeason: crop.growingSeason || 'spring',
        daysToMaturity: crop.daysToMaturity || 90,
        waterRequirement: crop.waterRequirement || 'moderate',
        climateSuitability: crop.climateSuitability || ['temperate'],
        soilPreferences: crop.soilPreferences || {
          texture: [],
          drainage: 'well-drained'
        },
        expectedYield: crop.expectedYield || {
          value: 1000,
          unit: 'kg/acre'
        },
        marketPrice: crop.marketPrice || {
          value: 0,
          currency: 'USD',
          unit: 'kg'
        },
        sustainabilityScore: crop.sustainabilityScore || 50
      });
    }
  }, [crop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (crop) {
        await api.put(`/admin/crops/${crop._id}`, formData);
        toast.success('Crop updated successfully');
      } else {
        await api.post('/admin/crops', formData);
        toast.success('Crop created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save crop');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {crop ? 'Edit Crop' : 'Add New Crop'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scientific Name</label>
                  <input
                    type="text"
                    name="scientificName"
                    value={formData.scientificName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="cereal">Cereal</option>
                    <option value="legume">Legume</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="fruit">Fruit</option>
                    <option value="oilseed">Oilseed</option>
                    <option value="fiber">Fiber</option>
                    <option value="forage">Forage</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Growing Season</label>
                  <select
                    name="growingSeason"
                    value={formData.growingSeason}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                    <option value="year-round">Year-round</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Water Requirement</label>
                  <select
                    name="waterRequirement"
                    value={formData.waterRequirement}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days to Maturity</label>
                  <input
                    type="number"
                    name="daysToMaturity"
                    value={formData.daysToMaturity}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drainage</label>
                  <select
                    name="soilPreferences.drainage"
                    value={formData.soilPreferences.drainage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="well-drained">Well-drained</option>
                    <option value="moderate">Moderate</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>

              {/* Expected Yield */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Expected Yield</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input
                      type="number"
                      name="expectedYield.value"
                      value={formData.expectedYield.value}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      name="expectedYield.unit"
                      value={formData.expectedYield.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="kg/acre">kg/acre</option>
                      <option value="tons/acre">tons/acre</option>
                      <option value="quintals/acre">quintals/acre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Market Price */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Market Price</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input
                      type="number"
                      name="marketPrice.value"
                      value={formData.marketPrice.value}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      name="marketPrice.currency"
                      value={formData.marketPrice.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      name="marketPrice.unit"
                      value={formData.marketPrice.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Nutrient Requirements */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Nutrient Requirements (kg/ha)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen</label>
                    <input
                      type="number"
                      name="nutrientRequirements.nitrogen"
                      value={formData.nutrientRequirements.nitrogen}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus</label>
                    <input
                      type="number"
                      name="nutrientRequirements.phosphorus"
                      value={formData.nutrientRequirements.phosphorus}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Potassium</label>
                    <input
                      type="number"
                      name="nutrientRequirements.potassium"
                      value={formData.nutrientRequirements.potassium}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sulfur</label>
                    <input
                      type="number"
                      name="nutrientRequirements.sulfur"
                      value={formData.nutrientRequirements.sulfur}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calcium</label>
                    <input
                      type="number"
                      name="nutrientRequirements.calcium"
                      value={formData.nutrientRequirements.calcium}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Magnesium</label>
                    <input
                      type="number"
                      name="nutrientRequirements.magnesium"
                      value={formData.nutrientRequirements.magnesium}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Optimal pH */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Optimal pH Range</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                    <input
                      type="number"
                      name="optimalPh.min"
                      value={formData.optimalPh.min}
                      onChange={handleChange}
                      min="0"
                      max="14"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                    <input
                      type="number"
                      name="optimalPh.max"
                      value={formData.optimalPh.max}
                      onChange={handleChange}
                      min="0"
                      max="14"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Climate Suitability */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Climate Suitability</h4>
                <div className="flex flex-wrap gap-3">
                  {['tropical', 'subtropical', 'temperate', 'arid', 'mediterranean'].map((climate) => (
                    <label key={climate} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.climateSuitability.includes(climate)}
                        onChange={(e) => handleMultiSelect(e, 'climateSuitability')}
                        value={climate}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{climate}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sustainability */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Sustainability Score</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score: {formData.sustainabilityScore}
                  </label>
                  <input
                    type="range"
                    name="sustainabilityScore"
                    value={formData.sustainabilityScore}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : crop ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropForm;
