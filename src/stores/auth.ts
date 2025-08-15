import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  tenantId: string
  tenantName: string
  role: 'admin' | 'user'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const currentTenant = computed(() => user.value?.tenantId)

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call - in real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data based on email domain for multi-tenant simulation
      const domain = email.split('@')[1]
      const tenantMap: Record<string, { tenantId: string; tenantName: string }> = {
        'company1.com': { tenantId: 'tenant-1', tenantName: 'Company 1' },
        'company2.com': { tenantId: 'tenant-2', tenantName: 'Company 2' },
        'demo.com': { tenantId: 'demo', tenantName: 'Demo Company' },
      }
      
      const tenant = tenantMap[domain] || { tenantId: 'default', tenantName: 'Default Company' }
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        tenantId: tenant.tenantId,
        tenantName: tenant.tenantName,
        role: email.includes('admin') ? 'admin' : 'user',
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      user.value = mockUser
      token.value = mockToken
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Invalid credentials' }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser)
      token.value = storedToken
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    currentTenant,
    login,
    logout,
    initializeAuth,
  }
})
