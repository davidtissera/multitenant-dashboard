import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  tenantId: string
  userId: string
}

export interface Budget {
  id: string
  category: string
  amount: number
  period: 'monthly' | 'yearly'
  tenantId: string
}

export const useExpensesStore = defineStore('expenses', () => {
  const authStore = useAuthStore()
  const expenses = ref<Expense[]>([])
  const budgets = ref<Budget[]>([])

  // Generate mock data for current tenant
  const generateMockData = () => {
    const tenantId = authStore.currentTenant
    if (!tenantId) return

    const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare']
    const mockExpenses: Expense[] = []
    const mockBudgets: Budget[] = []

    // Generate expenses for the last 3 months
    for (let i = 0; i < 50; i++) {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 90))
      
      mockExpenses.push({
        id: `exp-${i}`,
        amount: Math.floor(Math.random() * 500) + 10,
        description: `Expense ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: date.toISOString().split('T')[0],
        tenantId,
        userId: authStore.user?.id || '',
      })
    }

    // Generate budgets
    categories.forEach((category, index) => {
      mockBudgets.push({
        id: `budget-${index}`,
        category,
        amount: Math.floor(Math.random() * 2000) + 500,
        period: 'monthly',
        tenantId,
      })
    })

    expenses.value = mockExpenses
    budgets.value = mockBudgets
  }

  const tenantExpenses = computed(() => 
    expenses.value.filter(expense => expense.tenantId === authStore.currentTenant)
  )

  const tenantBudgets = computed(() => 
    budgets.value.filter(budget => budget.tenantId === authStore.currentTenant)
  )

  const expensesByCategory = computed(() => {
    const categoryMap: Record<string, number> = {}
    tenantExpenses.value.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount
    })
    return categoryMap
  })

  const monthlyExpenses = computed(() => {
    const monthMap: Record<string, number> = {}
    tenantExpenses.value.forEach(expense => {
      const month = expense.date.substring(0, 7) // YYYY-MM
      monthMap[month] = (monthMap[month] || 0) + expense.amount
    })
    return monthMap
  })

  const totalExpenses = computed(() => 
    tenantExpenses.value.reduce((total, expense) => total + expense.amount, 0)
  )

  const addExpense = (expense: Omit<Expense, 'id' | 'tenantId' | 'userId'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      tenantId: authStore.currentTenant || '',
      userId: authStore.user?.id || '',
    }
    expenses.value.push(newExpense)
  }

  const updateBudget = (budget: Omit<Budget, 'id' | 'tenantId'>) => {
    const existingIndex = budgets.value.findIndex(
      b => b.category === budget.category && b.tenantId === authStore.currentTenant
    )
    
    if (existingIndex >= 0) {
      budgets.value[existingIndex] = {
        ...budget,
        id: budgets.value[existingIndex].id,
        tenantId: authStore.currentTenant || '',
      }
    } else {
      budgets.value.push({
        ...budget,
        id: `budget-${Date.now()}`,
        tenantId: authStore.currentTenant || '',
      })
    }
  }

  return {
    expenses,
    budgets,
    tenantExpenses,
    tenantBudgets,
    expensesByCategory,
    monthlyExpenses,
    totalExpenses,
    addExpense,
    updateBudget,
    generateMockData,
  }
})
