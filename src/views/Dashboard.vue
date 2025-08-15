<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div class="text-sm text-gray-500">
          {{ currentDate }}
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Total Expenses</p>
              <p class="text-2xl font-bold text-gray-900">${{ totalExpenses.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCardIcon class="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900">${{ thisMonthExpenses.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Budget Used</p>
              <p class="text-2xl font-bold text-gray-900">{{ budgetUsedPercentage }}%</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Categories</p>
              <p class="text-2xl font-bold text-gray-900">{{ categoryCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TagIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Monthly Spending Trend -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
          <div class="h-64">
            <Line :data="monthlyChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <div class="h-64">
            <Doughnut :data="categoryChartData" :options="doughnutOptions" />
          </div>
        </div>
      </div>

      <!-- Recent Expenses -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Recent Expenses</h3>
          <router-link to="/expenses" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="expense in recentExpenses" :key="expense.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ expense.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getCategoryColor(expense.category)">
                    {{ expense.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(expense.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ expense.amount.toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  CreditCardIcon,
  CalendarIcon,
  ChartBarIcon,
  TagIcon,
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import AppLayout from '../components/AppLayout.vue'
import { useExpensesStore } from '../stores/expenses'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const expensesStore = useExpensesStore()

onMounted(() => {
  expensesStore.generateMockData()
})

const currentDate = computed(() => format(new Date(), 'MMMM d, yyyy'))
const totalExpenses = computed(() => expensesStore.totalExpenses)
const recentExpenses = computed(() => 
  expensesStore.tenantExpenses.slice(0, 5).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

const thisMonthExpenses = computed(() => {
  const currentMonth = format(new Date(), 'yyyy-MM')
  return expensesStore.monthlyExpenses[currentMonth] || 0
})

const budgetUsedPercentage = computed(() => {
  const totalBudget = expensesStore.tenantBudgets.reduce((sum, budget) => sum + budget.amount, 0)
  return totalBudget > 0 ? Math.round((thisMonthExpenses.value / totalBudget) * 100) : 0
})

const categoryCount = computed(() => Object.keys(expensesStore.expensesByCategory).length)

const monthlyChartData = computed(() => {
  const months = Object.keys(expensesStore.monthlyExpenses).sort()
  return {
    labels: months.map(month => format(new Date(month + '-01'), 'MMM yyyy')),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: months.map(month => expensesStore.monthlyExpenses[month]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }
})

const categoryChartData = computed(() => {
  const categories = Object.keys(expensesStore.expensesByCategory)
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ]
  
  return {
    labels: categories,
    datasets: [
      {
        data: categories.map(cat => expensesStore.expensesByCategory[cat]),
        backgroundColor: colors.slice(0, categories.length),
        borderWidth: 0,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

const getCategoryColor = (category: string) => {
  const colors = {
    Food: 'bg-red-100 text-red-800',
    Transportation: 'bg-blue-100 text-blue-800',
    Entertainment: 'bg-purple-100 text-purple-800',
    Shopping: 'bg-pink-100 text-pink-800',
    Bills: 'bg-yellow-100 text-yellow-800',
    Healthcare: 'bg-green-100 text-green-800',
  }
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: string) => format(new Date(date), 'MMM d, yyyy')
</script>
