<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
        <div class="flex items-center space-x-4">
          <select v-model="selectedPeriod" class="input-field w-auto">
            <option value="3">Last 3 months</option>
            <option value="6">Last 6 months</option>
            <option value="12">Last 12 months</option>
          </select>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Average Monthly</p>
              <p class="text-2xl font-bold text-gray-900">${{ averageMonthly.toLocaleString() }}</p>
              <p class="text-xs text-gray-500 mt-1">Per month</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Highest Category</p>
              <p class="text-lg font-bold text-gray-900">{{ highestCategory.name }}</p>
              <p class="text-xs text-gray-500 mt-1">${{ highestCategory.amount.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon class="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Trend</p>
              <p class="text-lg font-bold" :class="trendData.isIncreasing ? 'text-red-600' : 'text-green-600'">
                {{ trendData.isIncreasing ? '↗' : '↘' }} {{ trendData.percentage.toFixed(1) }}%
              </p>
              <p class="text-xs text-gray-500 mt-1">vs last period</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Budget Efficiency</p>
              <p class="text-lg font-bold" :class="budgetEfficiency >= 90 ? 'text-green-600' : budgetEfficiency >= 70 ? 'text-yellow-600' : 'text-red-600'">
                {{ budgetEfficiency.toFixed(0) }}%
              </p>
              <p class="text-xs text-gray-500 mt-1">On track</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Spending Trend Analysis -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Spending Trend Analysis</h3>
          <div class="h-64">
            <Line :data="trendChartData" :options="lineChartOptions" />
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <div class="h-64">
            <Pie :data="categoryPieData" :options="pieChartOptions" />
          </div>
        </div>

        <!-- Weekly Spending Pattern -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Weekly Spending Pattern</h3>
          <div class="h-64">
            <Bar :data="weeklyPatternData" :options="barChartOptions" />
          </div>
        </div>

        <!-- Budget vs Actual Comparison -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual</h3>
          <div class="h-64">
            <Bar :data="budgetComparisonData" :options="comparisonChartOptions" />
          </div>
        </div>
      </div>

      <!-- Insights Panel -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Financial Insights</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Spending Patterns</h4>
            <div v-for="insight in spendingInsights" :key="insight.type" class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-2 h-2 rounded-full mt-2" :class="insight.color"></div>
              <div>
                <p class="text-sm text-gray-900">{{ insight.title }}</p>
                <p class="text-xs text-gray-500">{{ insight.description }}</p>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Recommendations</h4>
            <div v-for="recommendation in recommendations" :key="recommendation.type" class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-2 h-2 rounded-full mt-2" :class="recommendation.color"></div>
              <div>
                <p class="text-sm text-gray-900">{{ recommendation.title }}</p>
                <p class="text-xs text-gray-500">{{ recommendation.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Line, Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import { format, getDay } from 'date-fns'
import AppLayout from '../components/AppLayout.vue'
import { useExpensesStore } from '../stores/expenses'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const expensesStore = useExpensesStore()
const selectedPeriod = ref('3')

onMounted(() => {
  expensesStore.generateMockData()
})

// Computed analytics
const averageMonthly = computed(() => {
  const months = Object.keys(expensesStore.monthlyExpenses)
  const totalSpent = months.reduce((sum, month) => sum + expensesStore.monthlyExpenses[month], 0)
  return months.length > 0 ? totalSpent / months.length : 0
})

const highestCategory = computed(() => {
  const categories = expensesStore.expensesByCategory
  const highest = Object.entries(categories).reduce(
    (max, [category, amount]) => amount > max.amount ? { name: category, amount } : max,
    { name: '', amount: 0 }
  )
  return highest
})

const trendData = computed(() => {
  const months = Object.keys(expensesStore.monthlyExpenses).sort()
  if (months.length < 2) return { isIncreasing: false, percentage: 0 }
  
  const lastMonth = expensesStore.monthlyExpenses[months[months.length - 1]]
  const previousMonth = expensesStore.monthlyExpenses[months[months.length - 2]]
  
  const percentage = previousMonth > 0 ? ((lastMonth - previousMonth) / previousMonth) * 100 : 0
  return {
    isIncreasing: percentage > 0,
    percentage: Math.abs(percentage),
  }
})

const budgetEfficiency = computed(() => {
  const totalBudget = expensesStore.tenantBudgets.reduce((sum, budget) => sum + budget.amount, 0)
  const currentMonth = format(new Date(), 'yyyy-MM')
  const currentSpent = expensesStore.monthlyExpenses[currentMonth] || 0
  
  return totalBudget > 0 ? Math.max(0, 100 - (currentSpent / totalBudget) * 100) : 0
})

// Chart data
const trendChartData = computed(() => {
  const months = Object.keys(expensesStore.monthlyExpenses).sort()
  return {
    labels: months.map(month => format(new Date(month + '-01'), 'MMM yyyy')),
    datasets: [
      {
        label: 'Monthly Spending',
        data: months.map(month => expensesStore.monthlyExpenses[month]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
})

const categoryPieData = computed(() => {
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

const weeklyPatternData = computed(() => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weeklySpending = new Array(7).fill(0)
  
  expensesStore.tenantExpenses.forEach(expense => {
    const dayOfWeek = getDay(new Date(expense.date))
    weeklySpending[dayOfWeek] += expense.amount
  })
  
  return {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Average Daily Spending',
        data: weeklySpending,
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  }
})

const budgetComparisonData = computed(() => {
  const categories = expensesStore.tenantBudgets.map(b => b.category)
  const budgetAmounts = expensesStore.tenantBudgets.map(b => b.amount)
  const actualAmounts = categories.map(category => 
    expensesStore.expensesByCategory[category] || 0
  )

  return {
    labels: categories,
    datasets: [
      {
        label: 'Budget',
        data: budgetAmounts,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Actual',
        data: actualAmounts,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }
})

// Chart options
const lineChartOptions = {
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

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

const barChartOptions = {
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

const comparisonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

// Insights and recommendations
const spendingInsights = computed(() => [
  {
    type: 'pattern',
    title: 'Peak spending day',
    description: `Most expenses occur on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][4]}`,
    color: 'bg-blue-500',
  },
  {
    type: 'category',
    title: 'Top expense category',
    description: `${highestCategory.value.name} accounts for most spending`,
    color: 'bg-red-500',
  },
  {
    type: 'trend',
    title: 'Spending trend',
    description: `Expenses are ${trendData.value.isIncreasing ? 'increasing' : 'decreasing'} by ${trendData.value.percentage.toFixed(1)}%`,
    color: trendData.value.isIncreasing ? 'bg-red-500' : 'bg-green-500',
  },
])

const recommendations = computed(() => [
  {
    type: 'budget',
    title: 'Budget optimization',
    description: 'Consider reducing spending in your highest expense category',
    color: 'bg-yellow-500',
  },
  {
    type: 'saving',
    title: 'Savings opportunity',
    description: `Reduce ${highestCategory.value.name} expenses by 10% to save $${(highestCategory.value.amount * 0.1).toFixed(0)}`,
    color: 'bg-green-500',
  },
  {
    type: 'planning',
    title: 'Financial planning',
    description: 'Set up automatic transfers to savings account',
    color: 'bg-blue-500',
  },
])
</script>
