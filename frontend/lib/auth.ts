"use client"

// Dummy authentication system using localStorage
export interface User {
  id: string
  name: string
  email: string
  farmLocation?: string
  joinedAt: string
}

export class AuthService {
  private static readonly USER_KEY = "krishichakra_user"
  private static readonly USERS_KEY = "krishichakra_users"

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem(this.USER_KEY)
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = this.getAllUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // In a real app, you'd verify the password hash
    // For demo purposes, we'll accept any password
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))

    return { success: true, user }
  }

  static async register(
    name: string,
    email: string,
    password: string,
    farmLocation?: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = this.getAllUsers()

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already registered" }
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      farmLocation,
      joinedAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser))

    return { success: true, user: newUser }
  }

  static logout(): void {
    localStorage.removeItem(this.USER_KEY)
  }

  private static getAllUsers(): User[] {
    if (typeof window === "undefined") return []

    const usersStr = localStorage.getItem(this.USERS_KEY)
    if (!usersStr) return []

    try {
      return JSON.parse(usersStr)
    } catch {
      return []
    }
  }
}
