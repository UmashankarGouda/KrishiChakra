"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

interface AppState {
  sidebarOpen: boolean
  theme: "light" | "dark"
  notifications: Notification[]
  farmData: FarmData | null
}

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
}

interface FarmData {
  totalArea: number
  currentCrops: string[]
  lastRotation: Date | null
  soilType: string
  location: string
}

type AppAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "ADD_NOTIFICATION"; payload: Omit<Notification, "id" | "timestamp"> }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_FARM_DATA"; payload: FarmData }
  | { type: "CLEAR_NOTIFICATIONS" }

const initialState: AppState = {
  sidebarOpen: false,
  theme: "light",
  notifications: [],
  farmData: null,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case "SET_THEME":
      return { ...state, theme: action.payload }
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.payload,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
          },
        ],
      }
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }
    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [] }
    case "SET_FARM_DATA":
      return { ...state, farmData: action.payload }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  removeNotification: (id: string) => void
  toggleSidebar: () => void
  setTheme: (theme: "light" | "dark") => void
  setFarmData: (data: FarmData) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { user } = useAuth()

  // Initialize farm data when user changes
  useEffect(() => {
    if (user && user.farmLocation) {
      dispatch({
        type: "SET_FARM_DATA",
        payload: {
          totalArea: 0,
          currentCrops: [],
          lastRotation: null,
          soilType: "Unknown",
          location: user.farmLocation,
        },
      })
    }
  }, [user])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification })

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: "REMOVE_NOTIFICATION", payload: notification.title })
    }, 5000)
  }

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id })
  }

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" })
  }

  const setTheme = (theme: "light" | "dark") => {
    dispatch({ type: "SET_THEME", payload: theme })
  }

  const setFarmData = (data: FarmData) => {
    dispatch({ type: "SET_FARM_DATA", payload: data })
  }

  const value: AppContextType = {
    state,
    dispatch,
    addNotification,
    removeNotification,
    toggleSidebar,
    setTheme,
    setFarmData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
