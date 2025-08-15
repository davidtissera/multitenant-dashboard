<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-bold text-gray-900">Expenses</h1>
        <button @click="showAddModal = true" class="btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Add Expense
        </button>
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select v-model="filters.category" class="input-field">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input v-model="filters.fromDate" type="date" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input v-model="filters.toDate" type="date" class="input-field" />
          </div>
          <div class="flex items-end">
            <button @click="clearFilters" class="btn-secondary w-full">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Expenses Table -->
      <div class="card">
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="expense in filteredExpenses" :key="expense.id">
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button class="text-red-600 hover:text-red-700">
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredExpenses.length === 0" class="text-center py-8 text-gray-500">
          No expenses found
        </div>
      </div>
    </div>

    <!-- Add Expense Modal -->
    <TransitionRoot as="template" :show="showAddModal">
      <Dialog as="div" class="relative z-50" @close="showAddModal = false">
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    Add New Expense
                  </DialogTitle>
                  <form @submit.prevent="addExpense" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input v-model="newExpense.description" type="text" required class="input-field" 
                             placeholder="Enter expense description" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input v-model.number="newExpense.amount" type="number" step="0.01" required class="input-field" 
                             placeholder="0.00" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select v-model="newExpense.category" required class="input-field">
                        <option value="">Select a category</option>
                        <option v-for="category in categories" :key="category" :value="category">
                          {{ category }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input v-model="newExpense.date" type="date" required class="input-field" />
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                      <button type="button" @click="showAddModal = false" class="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" class="btn-primary">
                        Add Expense
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
import { format } from 'date-fns'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppLayout from '../components/AppLayout.vue'
import { useExpensesStore } from '../stores/expenses'

const expensesStore = useExpensesStore()
const showAddModal = ref(false)

const filters = ref({
  category: '',
  fromDate: '',
  toDate: '',
})

const newExpense = ref({
  description: '',
  amount: 0,
  category: '',
  date: format(new Date(), 'yyyy-MM-dd'),
})

const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare']

onMounted(() => {
  expensesStore.generateMockData()
})

const filteredExpenses = computed(() => {
  let expenses = expensesStore.tenantExpenses

  if (filters.value.category) {
    expenses = expenses.filter(expense => expense.category === filters.value.category)
  }

  if (filters.value.fromDate) {
    expenses = expenses.filter(expense => expense.date >= filters.value.fromDate)
  }

  if (filters.value.toDate) {
    expenses = expenses.filter(expense => expense.date <= filters.value.toDate)
  }

  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const clearFilters = () => {
  filters.value = {
    category: '',
    fromDate: '',
    toDate: '',
  }
}

const addExpense = () => {
  expensesStore.addExpense(newExpense.value)
  newExpense.value = {
    description: '',
    amount: 0,
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  }
  showAddModal.value = false
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
