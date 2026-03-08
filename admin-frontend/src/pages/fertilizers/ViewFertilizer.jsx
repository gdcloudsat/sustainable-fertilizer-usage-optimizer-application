import React from 'react';
import { X, Package, DollarSign, Leaf, Award } from 'lucide-react';

const ViewFertilizer = ({ fertilizer, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Fertilizer Details
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
                  <Package className="text-green-600" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{fertilizer.name}</h4>
                  {fertilizer.manufacturer && (
                    <p className="text-sm text-gray-500">{fertilizer.manufacturer}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      fertilizer.type === 'organic' ? 'bg-green-100 text-green-800' :
                      fertilizer.type === 'inorganic' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {fertilizer.type}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {fertilizer.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {fertilizer.form}
                    </span>
                  </div>
                </div>
              </div>

              {/* NPK */}
              {fertilizer.npkRatio && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">NPK Ratio</h5>
                  <p className="text-2xl font-bold text-blue-600">{fertilizer.npkRatio}</p>
                </div>
              )}

              {/* Nutrient Content */}
              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Nutrient Content</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Nitrogen</p>
                    <p className="text-lg font-semibold text-gray-900">{fertilizer.nutrientContent?.nitrogen || 0}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Phosphorus</p>
                    <p className="text-lg font-semibold text-gray-900">{fertilizer.nutrientContent?.phosphorus || 0}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Potassium</p>
                    <p className="text-lg font-semibold text-gray-900">{fertilizer.nutrientContent?.potassium || 0}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Sulfur</p>
                    <p className="text-lg font-semibold text-gray-900">{fertilizer.nutrientContent?.sulfur || 0}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Calcium</p>
                    <p className="text-lg font-semibold text-gray-900">{fertilizer.nutrientContent?.calcium || 0}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Magnesium</p>
                    <p className="text-lg font-semibold text-gray-900">{fertilizer.nutrientContent?.magnesium || 0}%</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-xl font-semibold text-gray-900">
                      ${fertilizer.price?.value || 0} / {fertilizer.price?.unit || 'kg'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sustainability */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-700">Sustainability Score</h5>
                  {fertilizer.organicCertified && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Award size={16} />
                      <span className="text-xs font-semibold">Organic Certified</span>
                    </div>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-green-600"
                    style={{ width: `${fertilizer.sustainabilityScore || 0}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-600 mt-1">{fertilizer.sustainabilityScore || 0}/100</p>
              </div>

              {/* Environmental Impact */}
              {fertilizer.environmentalImpact && (
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Leaf size={16} />
                    Environmental Impact
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Carbon Footprint</p>
                      <p className="text-lg font-semibold text-gray-900">{fertilizer.environmentalImpact.carbonFootprint || 0} kg CO₂e</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Water Pollution Risk</p>
                      <p className="text-lg font-semibold capitalize text-gray-900">
                        {fertilizer.environmentalImpact.waterPollutionRisk || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Soil Health Impact</p>
                      <p className="text-lg font-semibold capitalize text-gray-900">
                        {fertilizer.environmentalImpact.soilHealthImpact || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="border-t pt-4 space-y-3">
                {fertilizer.releaseRate && (
                  <div>
                    <p className="text-xs text-gray-500">Release Rate</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{fertilizer.releaseRate}</p>
                  </div>
                )}
                {fertilizer.applicationMethod && fertilizer.applicationMethod.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Application Methods</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {fertilizer.applicationMethod.map((method, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded capitalize">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {fertilizer.storageInstructions && (
                  <div>
                    <p className="text-xs text-gray-500">Storage Instructions</p>
                    <p className="text-sm text-gray-900">{fertilizer.storageInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFertilizer;
