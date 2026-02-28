import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const FertilizerForm = ({ fertilizer, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'organic',
    category: 'straight',
    nutrientContent: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      sulfur: 0,
      calcium: 0,
      magnesium: 0,
      micronutrients: []
    },
    form: 'granular',
    applicationMethod: ['broadcast'],
    releaseRate: 'medium',
    price: {
      value: 0,
      currency: 'USD',
      unit: 'kg'
    },
    sustainabilityScore: 50,
    organicCertified: false,
    manufacturer: '',
    storageInstructions: '',
    environmentalImpact: {
      carbonFootprint: 0,
      waterPollutionRisk: 'low',
      soilHealthImpact: 'neutral'
    }
  });

  useEffect(() => {
    if (fertilizer) {
      setFormData({
        name: fertilizer.name || '',
        type: fertilizer.type || 'organic',
        category: fertilizer.category || 'straight',
        nutrientContent: fertilizer.nutrientContent || {
          nitrogen: 0,
          phosphorus: 0,
          potassium: 0,
          sulfur: 0,
          calcium: 0,
          magnesium: 0,
          micronutrients: []
        },
        form: fertilizer.form || 'granular',
        applicationMethod: fertilizer.applicationMethod || ['broadcast'],
        releaseRate: fertilizer.releaseRate || 'medium',
        price: fertilizer.price || {
          value: 0,
          currency: 'USD',
          unit: 'kg'
        },
        sustainabilityScore: fertilizer.sustainabilityScore || 50,
        organicCertified: fertilizer.organicCertified || false,
        manufacturer: fertilizer.manufacturer || '',
        storageInstructions: fertilizer.storageInstructions || '',
        environmentalImpact: fertilizer.environmentalImpact || {
          carbonFootprint: 0,
          waterPollutionRisk: 'low',
          soilHealthImpact: 'neutral'
        }
      });
    }
  }, [fertilizer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (fertilizer) {
        await api.put(`/admin/fertilizers/${fertilizer._id}`, formData);
        toast.success('Fertilizer updated successfully');
      } else {
        await api.post('/admin/fertilizers', formData);
        toast.success('Fertilizer created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save fertilizer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? Number(value) : type === 'checkbox' ? checked : value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
                {fertilizer ? 'Edit Fertilizer' : 'Add New Fertilizer'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="organic">Organic</option>
                    <option value="inorganic">Inorganic</option>
                    <option value="bio-fertilizer">Bio-fertilizer</option>
                    <option value="micronutrient">Micronutrient</option>
                    <option value="specialty">Specialty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="straight">Straight</option>
                    <option value="compound">Compound</option>
                    <option value="complex">Complex</option>
                    <option value="mixed">Mixed</option>
                    <option value="slow-release">Slow Release</option>
                    <option value="controlled-release">Controlled Release</option>
                    <option value="specialty">Specialty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form</label>
                  <select
                    name="form"
                    value={formData.form}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="granular">Granular</option>
                    <option value="powder">Powder</option>
                    <option value="liquid">Liquid</option>
                    <option value="pellet">Pellet</option>
                    <option value="prill">Prill</option>
                  </select>
                </div>
              </div>

              {/* NPK */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Nutrient Content</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (%)</label>
                    <input
                      type="number"
                      name="nutrientContent.nitrogen"
                      value={formData.nutrientContent.nitrogen}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus (%)</label>
                    <input
                      type="number"
                      name="nutrientContent.phosphorus"
                      value={formData.nutrientContent.phosphorus}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Potassium (%)</label>
                    <input
                      type="number"
                      name="nutrientContent.potassium"
                      value={formData.nutrientContent.potassium}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <input
                      type="number"
                      name="price.value"
                      value={formData.price.value}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      name="price.currency"
                      value={formData.price.currency}
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
                      name="price.unit"
                      value={formData.price.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                      <option value="ton">ton</option>
                      <option value="gallon">gallon</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sustainability */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Sustainability</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sustainability Score: {formData.sustainabilityScore}
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="organicCertified"
                      id="organicCertified"
                      checked={formData.organicCertified}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="organicCertified" className="ml-2 text-sm text-gray-700">
                      Organic Certified
                    </label>
                  </div>
                </div>
              </div>

              {/* Storage Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Instructions</label>
                <textarea
                  name="storageInstructions"
                  value={formData.storageInstructions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
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
                  {loading ? 'Saving...' : fertilizer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilizerForm;
