import React from 'react';
import { X, Leaf, Calendar, Droplets, Thermometer } from 'lucide-react';

const ViewCrop = ({ crop, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Crop Details
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Leaf className="text-green-600" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{crop.name}</h4>
                  {crop.scientificName && (
                    <p className="text-sm text-gray-500 italic">{crop.scientificName}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                      {crop.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Growth Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Calendar className="text-blue-600 mb-1" size={16} />
                  <p className="text-xs text-gray-500">Season</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{crop.growingSeason || 'N/A'}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Calendar className="text-green-600 mb-1" size={16} />
                  <p className="text-xs text-gray-500">Maturity</p>
                  <p className="text-sm font-semibold text-gray-900">{crop.daysToMaturity || 'N/A'} days</p>
                </div>
                <div className="bg-cyan-50 p-3 rounded-lg">
                  <Droplets className="text-cyan-600 mb-1" size={16} />
                  <p className="text-xs text-gray-500">Water</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{crop.waterRequirement || 'N/A'}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <Thermometer className="text-orange-600 mb-1" size={16} />
                  <p className="text-xs text-gray-500">pH Range</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {crop.optimalPh?.min || 0} - {crop.optimalPh?.max || 0}
                  </p>
                </div>
              </div>

              {/* Nutrient Requirements */}
              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Nutrient Requirements (kg/ha)</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Nitrogen (N)</p>
                    <p className="text-lg font-semibold text-gray-900">{crop.nutrientRequirements?.nitrogen || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Phosphorus (P)</p>
                    <p className="text-lg font-semibold text-gray-900">{crop.nutrientRequirements?.phosphorus || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Potassium (K)</p>
                    <p className="text-lg font-semibold text-gray-900">{crop.nutrientRequirements?.potassium || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Sulfur (S)</p>
                    <p className="text-lg font-semibold text-gray-900">{crop.nutrientRequirements?.sulfur || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Calcium (Ca)</p>
                    <p className="text-lg font-semibold text-gray-900">{crop.nutrientRequirements?.calcium || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Magnesium (Mg)</p>
                    <p className="text-lg font-semibold text-gray-900">{crop.nutrientRequirements?.magnesium || 0}</p>
                  </div>
                </div>
              </div>

              {/* Climate Suitability */}
              {crop.climateSuitability && crop.climateSuitability.length > 0 && (
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Climate Suitability</h5>
                  <div className="flex flex-wrap gap-2">
                    {crop.climateSuitability.map((climate, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded capitalize">
                        {climate}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Soil Preferences */}
              {crop.soilPreferences && (
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Soil Preferences</h5>
                  <div className="space-y-2">
                    {crop.soilPreferences.drainage && (
                      <div>
                        <p className="text-xs text-gray-500">Drainage</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{crop.soilPreferences.drainage}</p>
                      </div>
                    )}
                    {crop.soilPreferences.texture && crop.soilPreferences.texture.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500">Texture</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {crop.soilPreferences.texture.map((texture, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                              {texture}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sustainability Score */}
              {crop.sustainabilityScore !== undefined && (
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Sustainability Score</h5>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-green-600"
                      style={{ width: `${crop.sustainabilityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">{crop.sustainabilityScore}/100</p>
                </div>
              )}

              {/* Yield Info */}
              {crop.expectedYield && (
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Expected Yield</h5>
                  <p className="text-lg font-semibold text-gray-900">
                    {crop.expectedYield.value || 0} {crop.expectedYield.unit || ''}
                  </p>
                </div>
              )}

              {/* Market Price */}
              {crop.marketPrice && (
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Market Price</h5>
                  <p className="text-lg font-semibold text-gray-900">
                    ${crop.marketPrice.value || 0} {crop.marketPrice.currency || ''} / {crop.marketPrice.unit || ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCrop;
