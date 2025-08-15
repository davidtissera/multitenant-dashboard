<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0" 
         :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900">{{ authStore.user?.tenantName }}</h1>
        <button @click="toggleSidebar" class="lg:hidden">
          <XMarkIcon class="h-6 w-6 text-gray-500" />
        </button>
      </div>
      
      <nav class="mt-6">
        <div class="px-6 space-y-1">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="[
              $route.name === item.current 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            {{ item.name }}
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <div class="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-6">
          <button @click="toggleSidebar" class="lg:hidden">
            <Bars3Icon class="h-6 w-6 text-gray-500" />
          </button>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              Welcome, {{ authStore.user?.name }}
            </div>
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center space-x-2 text-sm">
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium">{{ userInitials }}</span>
                </div>
              </MenuButton>
              
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="logout"
                        :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <main class="p-6">
        <slot />
      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <div v-if="sidebarOpen" @click="toggleSidebar" class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"></div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CreditCardIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'

export default defineComponent({
  name: 'AppLayout',
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    CreditCardIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const sidebarOpen = ref(false)

    const navigation = [
      { name: 'Dashboard', href: '/', icon: HomeIcon, current: 'dashboard' },
      { name: 'Expenses', href: '/expenses', icon: CreditCardIcon, current: 'expenses' },
      { name: 'Budget', href: '/budget', icon: CurrencyDollarIcon, current: 'budget' },
      { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: 'analytics' },
    ]

    const userInitials = computed(() => {
      const name = authStore.user?.name || ''
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    })

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const logout = () => {
      authStore.logout()
      router.push('/login')
    }

    return {
      router,
      authStore,
      sidebarOpen,
      navigation,
      userInitials,
      toggleSidebar,
      logout,
    }
  }
})
</script>
