import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import FertilizerForm from './FertilizerForm';
import ViewFertilizer from './ViewFertilizer';

const FertilizerList = () => {
  const [fertilizers, setFertilizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFertilizer, setEditingFertilizer] = useState(null);
  const [viewingFertilizer, setViewingFertilizer] = useState(null);

  useEffect(() => {
    fetchFertilizers();
  }, [search, typeFilter]);

  const fetchFertilizers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (typeFilter) params.append('type', typeFilter);

      const response = await api.get(`/admin/fertilizers?${params.toString()}`);
      setFertilizers(response.data.fertilizers || []);
    } catch (error) {
      toast.error('Failed to fetch fertilizers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fertilizer?')) return;

    try {
      await api.delete(`/admin/fertilizers/${id}`);
      toast.success('Fertilizer deleted successfully');
      fetchFertilizers();
    } catch (error) {
      toast.error('Failed to delete fertilizer');
    }
  };

  const handleEdit = (fertilizer) => {
    setEditingFertilizer(fertilizer);
    setShowForm(true);
  };

  const handleView = (fertilizer) => {
    setViewingFertilizer(fertilizer);
  };

  const handleAdd = () => {
    setEditingFertilizer(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingFertilizer(null);
    fetchFertilizers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Fertilizer Management</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Fertilizer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search fertilizers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">All Types</option>
            <option value="organic">Organic</option>
            <option value="inorganic">Inorganic</option>
            <option value="bio-fertilizer">Bio-fertilizer</option>
            <option value="micronutrient">Micronutrient</option>
            <option value="specialty">Specialty</option>
          </select>
        </div>
      </div>

      {/* Fertilizers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NPK Ratio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sustainability Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fertilizers.length > 0 ? (
                fertilizers.map((fertilizer) => (
                  <tr key={fertilizer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fertilizer.name}</div>
                      {fertilizer.manufacturer && (
                        <div className="text-sm text-gray-500">{fertilizer.manufacturer}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        fertilizer.type === 'organic' ? 'bg-green-100 text-green-800' :
                        fertilizer.type === 'inorganic' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {fertilizer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fertilizer.npkRatio || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${fertilizer.price?.value || 0} / {fertilizer.price?.unit || 'kg'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-600"
                            style={{ width: `${fertilizer.sustainabilityScore || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{fertilizer.sustainabilityScore || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleView(fertilizer)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(fertilizer)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(fertilizer._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No fertilizers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <FertilizerForm
          fertilizer={editingFertilizer}
          onClose={handleFormClose}
        />
      )}

      {/* View Modal */}
      {viewingFertilizer && (
        <ViewFertilizer
          fertilizer={viewingFertilizer}
          onClose={() => setViewingFertilizer(null)}
        />
      )}
    </div>
  );
};

export default FertilizerList;
