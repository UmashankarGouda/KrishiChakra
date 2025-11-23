"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Bell, Shield, Smartphone, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { updateProfile } from "@/lib/supabase"
import { states } from "@/lib/crop-data"

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    farm_name: profile?.farm_name || '',
    farm_location: profile?.farm_location || '',
    farm_size: profile?.farm_size || 0,
  })

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        farm_name: profile.farm_name || '',
        farm_location: profile.farm_location || '',
        farm_size: profile.farm_size || 0,
      })
    }
  }, [profile])
  const [notifications, setNotifications] = useState({
    weather: true,
    rotation: true,
    market: false,
    tips: true,
  })

  const handleSaveProfile = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const { error } = await updateProfile(user.id, {
        ...formData,
        updated_at: new Date().toISOString(),
      })
      
      if (error) {
        console.error('Error updating profile:', error)
      } else {
        await refreshProfile()
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center drop-shadow-sm">
          <Settings className="mr-4 h-10 w-10 text-green-600" />
          Profile Settings
        </h1>
        <p className="text-gray-600 mt-3 text-lg">Manage your account preferences and application settings</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
            <User className="mr-3 h-6 w-6 text-green-600" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">Update your personal information and farm details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</Label>
              <Input 
                id="name" 
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={user?.email || ''} 
                disabled 
                className="bg-gray-50 border-gray-200 text-gray-500"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="farm-name" className="text-sm font-semibold text-gray-700">Farm Name</Label>
              <Input 
                id="farm-name" 
                value={formData.farm_name}
                onChange={(e) => setFormData(prev => ({ ...prev, farm_name: e.target.value }))}
                placeholder="Enter your farm name"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Farm Location</Label>
              <Select 
                value={formData.farm_location} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, farm_location: value }))}
              >
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="farm-size" className="text-sm font-semibold text-gray-700">Farm Size (Hectares)</Label>
              <Input 
                id="farm-size" 
                type="number"
                value={formData.farm_size}
                onChange={(e) => setFormData(prev => ({ ...prev, farm_size: Number(e.target.value) }))}
                placeholder="Enter farm size in hectares"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
          <Button 
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
            <Bell className="mr-3 h-6 w-6 text-green-600" />
            Notifications
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weather Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified about weather changes affecting your crops</p>
            </div>
            <Switch
              checked={notifications.weather}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weather: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rotation Reminders</Label>
              <p className="text-sm text-muted-foreground">Reminders for optimal crop rotation timing</p>
            </div>
            <Switch
              checked={notifications.rotation}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, rotation: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Market Prices</Label>
              <p className="text-sm text-muted-foreground">Updates on crop market prices and trends</p>
            </div>
            <Switch
              checked={notifications.market}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, market: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Farming Tips</Label>
              <p className="text-sm text-muted-foreground">Weekly tips and best practices for better farming</p>
            </div>
            <Switch
              checked={notifications.tips}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, tips: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
            <Shield className="mr-3 h-6 w-6 text-green-600" />
            Security
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
            <Smartphone className="mr-3 h-6 w-6 text-green-600" />
            App Preferences
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch to dark theme for better viewing in low light</p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="english">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="punjabi">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="units">Measurement Units</Label>
            <Select defaultValue="metric">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (Hectares, Celsius)</SelectItem>
                <SelectItem value="imperial">Imperial (Acres, Fahrenheit)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
