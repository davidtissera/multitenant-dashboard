<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Budget Management</h1>
      </div>

      <!-- Budget Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Budget Progress Chart -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Budget Progress</h3>
          <div class="h-64">
            <Bar :data="budgetProgressData" :options="chartOptions" />
          </div>
        </div>

        <!-- Budget Summary -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Budget Summary</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Budget</span>
              <span class="font-semibold">${{ totalBudget.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Spent</span>
              <span class="font-semibold">${{ totalSpent.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Remaining</span>
              <span class="font-semibold" :class="remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'">
                ${{ Math.abs(remainingAmount).toLocaleString() }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="budgetUsagePercentage > 100 ? 'bg-red-500' : budgetUsagePercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'"
                :style="{ width: Math.min(budgetUsagePercentage, 100) + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-500">
              {{ budgetUsagePercentage.toFixed(1) }}% of budget used
            </p>
          </div>
        </div>
      </div>

      <!-- Budget Categories -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Budget by Category</h3>
          <button @click="showEditModal = true" class="btn-primary">
            <PencilIcon class="h-4 w-4 mr-2" />
            Edit Budgets
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="budget in budgetsWithSpending" :key="budget.id" class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">{{ budget.category }}</h4>
              <span class="text-sm text-gray-500">${{ budget.amount.toLocaleString() }}</span>
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Spent</span>
                <span class="font-medium">${{ budget.spent.toLocaleString() }}</span>
              </div>
              
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="budget.percentage > 100 ? 'bg-red-500' : budget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'"
                  :style="{ width: Math.min(budget.percentage, 100) + '%' }"
                ></div>
              </div>
              
              <div class="flex justify-between text-xs text-gray-500">
                <span>{{ budget.percentage.toFixed(1) }}% used</span>
                <span class="font-medium" :class="budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'">
                  ${{ Math.abs(budget.remaining).toLocaleString() }} {{ budget.remaining >= 0 ? 'left' : 'over' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Budget Modal -->
    <TransitionRoot as="template" :show="showEditModal">
      <Dialog as="div" class="relative z-50" @close="showEditModal = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    Edit Budget Allocations
                  </DialogTitle>
                  <form @submit.prevent="saveBudgets" class="space-y-4">
                    <div v-for="(budget, index) in editableBudgets" :key="budget.category" class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ budget.category }}</label>
                        <input v-model.number="editableBudgets[index].amount" type="number" step="1" min="0" 
                               class="input-field" placeholder="Budget amount" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Period</label>
                        <select v-model="editableBudgets[index].period" class="input-field">
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                      <button type="button" @click="showEditModal = false" class="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" class="btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { PencilIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
// @ts-ignore
import AppLayout from '../components/AppLayout.vue'
import { useExpensesStore } from '../stores/expenses'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const expensesStore = useExpensesStore()
const showEditModal = ref(false)
const editableBudgets = ref<any[]>([])

onMounted(() => {
  expensesStore.generateMockData()
  initializeEditableBudgets()
})

const currentMonth = format(new Date(), 'yyyy-MM')

const totalBudget = computed(() => 
  expensesStore.tenantBudgets.reduce((sum, budget) => sum + budget.amount, 0)
)

const totalSpent = computed(() => 
  expensesStore.monthlyExpenses[currentMonth] || 0
)

const remainingAmount = computed(() => totalBudget.value - totalSpent.value)

const budgetUsagePercentage = computed(() => 
  totalBudget.value > 0 ? (totalSpent.value / totalBudget.value) * 100 : 0
)

const budgetsWithSpending = computed(() => {
  return expensesStore.tenantBudgets.map(budget => {
    const spent = Object.entries(expensesStore.expensesByCategory)
      .find(([category]) => category === budget.category)?.[1] || 0
    
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
    const remaining = budget.amount - spent
    
    return {
      ...budget,
      spent,
      percentage,
      remaining,
    }
  })
})

const budgetProgressData = computed(() => {
  const categories = expensesStore.tenantBudgets.map(b => b.category)
  const budgetAmounts = expensesStore.tenantBudgets.map(b => b.amount)
  const spentAmounts = categories.map(category => 
    expensesStore.expensesByCategory[category] || 0
  )

  return {
    labels: categories,
    datasets: [
      {
        label: 'Budget',
        data: budgetAmounts,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Spent',
        data: spentAmounts,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = {
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

const initializeEditableBudgets = () => {
  editableBudgets.value = expensesStore.tenantBudgets.map(budget => ({ ...budget }))
}

const saveBudgets = () => {
  editableBudgets.value.forEach(budget => {
    expensesStore.updateBudget({
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
    })
  })
  showEditModal.value = false
}
</script>
