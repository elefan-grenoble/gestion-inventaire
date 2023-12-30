// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    inventoryYear: null,
    locationChoices: [],
    googleSheetsData: {},  // key = locationChoice
    lastLocationUsed: null
  }),
})
