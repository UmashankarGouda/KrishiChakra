"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrendingUp, Sprout, MapPin, Calendar, Zap, Plus, Edit2, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { FieldBatch } from "@/lib/types"
import { getFieldBatches, createFieldBatch, updateFieldBatch, deleteFieldBatch } from "@/lib/supabase"
import { VoiceConversational } from "@/components/voice-conversational"
import Link from "next/link"

export default function DashboardPage() {
  const { user, profile } = useAuth()
  
  const [fieldBatches, setFieldBatches] = useState<FieldBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false)
  const [isVoiceInputOpen, setIsVoiceInputOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [voiceAnswers, setVoiceAnswers] = useState<string[]>([])
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [voiceLanguage, setVoiceLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN')
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null)
  const [editingField, setEditingField] = useState<FieldBatch | null>(null)
  const [newField, setNewField] = useState<{
    name: string
    location: string
    soil_type: string
    season: string
    climate_zone: string
    current_crop: string
    size: number
    status: 'active' | 'planning' | 'fallow' | 'harvested'
    notes: string
  }>({
    name: '',
    location: '',
    soil_type: '',
    season: '',
    climate_zone: '',
    current_crop: '',
    size: 0,
    status: 'planning',
    notes: ''
  })

  // Load field batches from Supabase
  useEffect(() => {
    const loadFieldBatches = async () => {
      if (!user?.id) return
      
      setLoading(true)
      const { data, error } = await getFieldBatches(user.id)
      
      if (error) {
        console.error('Error loading field batches:', error)
      } else {
        setFieldBatches(data || [])
      }
      setLoading(false)
    }

    loadFieldBatches()
  }, [user?.id])

  // Add new field batch
  const handleAddField = async () => {
    if (!user?.id || !newField.name || !newField.soil_type || !newField.season || !newField.size) return

    const { data, error } = await createFieldBatch(user.id, newField)
    
    if (error) {
      console.error('Error creating field batch:', error)
    } else if (data) {
      setFieldBatches([data, ...fieldBatches])
      setNewField({
        name: '',
        location: '',
        soil_type: '',
        season: '',
        climate_zone: '',
        current_crop: '',
        size: 0,
        status: 'planning',
        notes: ''
      })
      setIsAddFieldOpen(false)
    }
  }

  // Edit field batch
  const handleEditField = (field: FieldBatch) => {
    setEditingField(field)
    setNewField({
      name: field.name,
      location: field.location,
      soil_type: field.soil_type,
      season: field.season,
      climate_zone: field.climate_zone,
      current_crop: field.current_crop || '',
      size: field.size,
      status: field.status,
      notes: field.notes || ''
    })
    setIsAddFieldOpen(true)
  }

  // Update field batch
  const handleUpdateField = async () => {
    if (!editingField || !newField.name || !newField.soil_type || !newField.season || !newField.size) return

    const { data, error } = await updateFieldBatch(editingField.id, newField)
    
    if (error) {
      console.error('Error updating field batch:', error)
    } else if (data) {
      setFieldBatches(fieldBatches.map(field => 
        field.id === editingField.id ? data : field
      ))
      setEditingField(null)
      setNewField({
        name: '',
        location: '',
        soil_type: '',
        season: '',
        climate_zone: '',
        current_crop: '',
        size: 0,
        status: 'planning',
        notes: ''
      })
      setIsAddFieldOpen(false)
    }
  }

  // Delete field batch
  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return
    
    const { error } = await deleteFieldBatch(fieldId)
    
    if (error) {
      console.error('Error deleting field batch:', error)
    } else {
      setFieldBatches(fieldBatches.filter(field => field.id !== fieldId))
    }
  }

  // Handle voice input completion
  const handleVoiceInputComplete = (voiceData: any) => {
    setNewField(prev => ({
      ...prev,
      ...voiceData
    }))
    setIsVoiceInputOpen(false)
    setIsAddFieldOpen(true)
  }

  // Only include options that RAG can provide meaningful recommendations for
  const soilTypes = ['Clay', 'Clay Loam', 'Sandy', 'Sandy Loam', 'Silt', 'Silt Loam', 'Black Soil', 'Red Soil', 'Alluvial']
  const seasons = ['Kharif', 'Rabi', 'Zaid']  // Removed 'Perennial' - RAG focuses on seasonal crops
  const climateZones = ['Tropical', 'Sub-tropical', 'Semi-Arid', 'Arid', 'Temperate']
  
  // Only crops with good RAG coverage - focusing on Rice-Wheat-Legume systems
  const crops = [
    'Rice', 'Wheat', 
    'Chickpea', 'Green Gram', 'Peas', 'Soybean', 'Cowpea',  // Legumes with good coverage
    'Sunflower', 'Maize', 'Potato', 'Barley',  // Good coverage
    'Canola', 'Rapeseed',  // Limited but usable
    'Fallow (No Crop)'  // Important for rotation planning
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your field batches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
            Welcome back, {profile?.full_name || user?.email || "Farmer"}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your fields and get AI-powered crop rotation recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fields</p>
                  <p className="text-3xl font-bold text-gray-800">{fieldBatches.length}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-xl">
                  <Sprout className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Area</p>
                  <p className="text-3xl font-bold text-gray-800">{fieldBatches.reduce((sum, field) => sum + field.size, 0)} ha</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-xl">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Fields</p>
                  <p className="text-3xl font-bold text-gray-800">{fieldBatches.filter(f => f.status === "active").length}</p>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-3 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Planning Fields</p>
                  <p className="text-3xl font-bold text-gray-800">{fieldBatches.filter(f => f.status === "planning").length}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-3 rounded-xl">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-2xl font-bold text-gray-800">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-2 rounded-xl mr-3">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded"></div>
                    <div className="w-2 h-2 bg-green-600 rounded"></div>
                    <div className="w-2 h-2 bg-yellow-600 rounded"></div>
                    <div className="w-2 h-2 bg-orange-600 rounded"></div>
                  </div>
                </div>
                Field Batches ({fieldBatches.length})
              </div>
              <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    onClick={() => {
                      setEditingField(null)
                      setNewField({
                        name: '',
                        location: '',
                        soil_type: '',
                        season: '',
                        climate_zone: '',
                        current_crop: '',
                        size: 0,
                        status: 'planning',
                        notes: ''
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>{editingField ? 'Edit Field' : 'Add New Field'}</span>
                    </DialogTitle>
                    <DialogDescription>
                      {editingField ? 'Update your field information' : 'Add field details to get AI-powered crop rotation recommendations based on research data'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4 max-h-[80vh] overflow-y-auto">
                    {/* Voice Input - Inline Conversational */}
                    {!editingField && (
                      <VoiceConversational
                        onFieldUpdate={(fieldName: string, value: any) => {
                          setNewField(prev => ({ ...prev, [fieldName]: value }))
                        }}
                        language={voiceLanguage}
                        onLanguageChange={setVoiceLanguage}
                      />
                    )}
                    
                    {/* Basic Field Info */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Sprout className="h-4 w-4" />
                        Basic Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Field Name *</Label>
                          <Input
                            id="name"
                            value={newField.name}
                            onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., North Field A"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="size">Size (hectares) *</Label>
                          <Input
                            id="size"
                            type="number"
                            step="0.1"
                            value={newField.size || ''}
                            onChange={(e) => setNewField(prev => ({ ...prev, size: parseFloat(e.target.value) || 0 }))}
                            placeholder="e.g., 2.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fields Used by AI - These are important */}
                    <div className="space-y-4 border-2 border-green-200 rounded-lg p-4 bg-green-50">
                      <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        AI Recommendation Inputs (Required for smart suggestions)
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="soilType" className="text-green-900">Soil Type *</Label>
                          <Select value={newField.soil_type} onValueChange={(value) => setNewField(prev => ({ ...prev, soil_type: value }))}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select soil type" />
                            </SelectTrigger>
                            <SelectContent>
                              {soilTypes.map((soil) => (
                                <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="season" className="text-green-900">Primary Season *</Label>
                          <Select value={newField.season} onValueChange={(value) => setNewField(prev => ({ ...prev, season: value }))}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                            <SelectContent>
                              {seasons.map((season) => (
                                <SelectItem key={season} value={season}>{season}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="climateZone" className="text-green-900">Climate Zone *</Label>
                          <Select value={newField.climate_zone} onValueChange={(value) => setNewField(prev => ({ ...prev, climate_zone: value }))}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select climate" />
                            </SelectTrigger>
                            <SelectContent>
                              {climateZones.map((climate) => (
                                <SelectItem key={climate} value={climate}>{climate}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentCrop" className="text-green-900">Current Crop</Label>
                          <Select value={newField.current_crop} onValueChange={(value) => setNewField(prev => ({ ...prev, current_crop: value }))}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select crop or fallow" />
                            </SelectTrigger>
                            <SelectContent>
                              {crops.map((crop) => (
                                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-green-700">AI focuses on Rice-Wheat-Legume rotations</p>
                        </div>
                      </div>
                    </div>

                    {/* Optional tracking fields */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700">Additional Tracking (Optional)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location/Section</Label>
                          <Input
                            id="location"
                            value={newField.location}
                            onChange={(e) => setNewField(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g., North Section"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Field Status</Label>
                          <Select value={newField.status} onValueChange={(value) => setNewField(prev => ({ ...prev, status: value as any }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planning">Planning</SelectItem>
                              <SelectItem value="active">Active/Planted</SelectItem>
                              <SelectItem value="fallow">Fallow</SelectItem>
                              <SelectItem value="harvested">Harvested</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                          id="notes"
                          value={newField.notes}
                          onChange={(e) => setNewField(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any additional observations or plans"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsAddFieldOpen(false)
                      setEditingField(null)
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={editingField ? handleUpdateField : handleAddField}
                      disabled={!newField.name || !newField.soil_type || !newField.season || !newField.climate_zone || !newField.size}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      {editingField ? 'Update Field' : 'Add Field'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">Field batches with soil and climate data stored in Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {fieldBatches.map((field) => (
                <Card key={field.id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{field.name}</h3>
                        <p className="text-sm text-gray-600">{field.location}</p>
                        <p className="text-sm text-gray-700 mb-1">
                          {field.current_crop ? field.current_crop + " • " : ""}{field.size} hectares
                        </p>
                      </div>
                      <Badge 
                        variant={field.status === "active" ? "default" : field.status === "planning" ? "secondary" : "outline"}
                        className={field.status === "active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {field.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Soil:</span>
                        <span className="font-medium">{field.soil_type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Season:</span>
                        <span className="font-medium">{field.season}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Climate:</span>
                        <span className="font-medium">{field.climate_zone}</span>
                      </div>
                    </div>

                    {field.notes && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-3">{field.notes}</p>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/dashboard/rotation/custom?field=${field.id}`} className="flex-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                        >
                          <Zap className="mr-1 h-3 w-3" />
                          AI Plan
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => handleEditField(field)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteField(field.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
