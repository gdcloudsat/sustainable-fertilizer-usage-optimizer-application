import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { soilService } from '../services/api'
import SoilHealthCard from '../components/SoilHealthCard'
import { Beaker, Plus, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

const SoilInput = () => {
  const [soilTests, setSoilTests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    phLevel: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
    moistureContent: '',
    soilTexture: 'loamy',
    testMethod: 'field-kit'
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    fetchSoilTests()
  }, [])

  const fetchSoilTests = async () => {
    try {
      const tests = await soilService.getAll()
      setSoilTests(tests)
    } catch (error) {
      toast.error('Failed to load soil tests')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'soilTexture' || name === 'testMethod' ? value : parseFloat(value) || ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        await soilService.update(editingId, formData)
        toast.success('Soil test updated successfully')
      } else {
        await soilService.create(formData)
        toast.success('Soil test added successfully')
      }
      
      setFormData({
        phLevel: '',
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        organicMatter: '',
        moistureContent: '',
        soilTexture: 'loamy',
        testMethod: 'field-kit'
      })
      setShowForm(false)
      setEditingId(null)
      fetchSoilTests()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save soil test')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (test) => {
    setFormData({
      phLevel: test.phLevel,
      nitrogen: test.nitrogen,
      phosphorus: test.phosphorus,
      potassium: test.potassium,
      organicMatter: test.organicMatter || '',
      moistureContent: test.moistureContent || '',
      soilTexture: test.soilTexture || 'loamy',
      testMethod: test.testMethod || 'field-kit'
    })
    setEditingId(test._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this soil test?')) return

    try {
      await soilService.delete(id)
      toast.success('Soil test deleted')
      fetchSoilTests()
    } catch (error) {
      toast.error('Failed to delete soil test')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="section-title">Soil Health Data</h1>
          <p className="section-subtitle">
            Track and manage your soil test results for better recommendations
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              phLevel: '',
              nitrogen: '',
              phosphorus: '',
              potassium: '',
              organicMatter: '',
              moistureContent: '',
              soilTexture: 'loamy',
              testMethod: 'field-kit'
            })
          }}
          className="btn-primary mt-4 md:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Soil Test'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <Beaker className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-earth-900">
              {editingId ? 'Edit Soil Test' : 'New Soil Test'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="label">pH Level (0-14)</label>
                <input
                  type="number"
                  name="phLevel"
                  value={formData.phLevel}
                  onChange={handleChange}
                  min="0"
                  max="14"
                  step="0.1"
                  required
                  className="input"
                  placeholder="6.5"
                />
              </div>

              <div>
                <label className="label">Nitrogen (mg/kg)</label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                  className="input"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="label">Phosphorus (mg/kg)</label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                  className="input"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="label">Potassium (mg/kg)</label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                  className="input"
                  placeholder="150"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="label">Organic Matter (%)</label>
                <input
                  type="number"
                  name="organicMatter"
                  value={formData.organicMatter}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="input"
                  placeholder="3.5"
                />
              </div>

              <div>
                <label className="label">Moisture Content (%)</label>
                <input
                  type="number"
                  name="moistureContent"
                  value={formData.moistureContent}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="input"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="label">Soil Texture</label>
                <select
                  name="soilTexture"
                  value={formData.soilTexture}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="sandy">Sandy</option>
                  <option value="loamy">Loamy</option>
                  <option value="clay">Clay</option>
                  <option value="silty">Silty</option>
                  <option value="sandy-loam">Sandy Loam</option>
                  <option value="clay-loam">Clay Loam</option>
                  <option value="silty-loam">Silty Loam</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Test Method</label>
                <select
                  name="testMethod"
                  value={formData.testMethod}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="lab">Laboratory Analysis</option>
                  <option value="field-kit">Field Test Kit</option>
                  <option value="sensor">Soil Sensor</option>
                  <option value="estimated">Visual Estimate</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  editingId ? 'Update Test' : 'Save Test'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Soil Tests List */}
      <div>
        <h2 className="text-xl font-semibold text-earth-900 mb-4">Your Soil Tests</h2>
        
        {soilTests.length === 0 ? (
          <div className="card text-center py-12">
            <Beaker className="h-12 w-12 text-earth-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-earth-700 mb-2">No Soil Tests Yet</h3>
            <p className="text-earth-500">Add your first soil test to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {soilTests.map((test) => (
              <div key={test._id} className="relative">
                <SoilHealthCard soil={test} />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(test)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-earth-50 text-earth-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(test._id)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SoilInput
