// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    inventoryYear: null,
    locationChoices: [
      {name: 'Réserve', rows_table_id: '846eb625-57bd-4b74-b2e6-7df6c6bf2143'},
      {name: 'Magasin', rows_table_id: '982aa844-3040-4c2e-9d4e-378d8b764157'}
    ],
    googleSheetsData: {},  // key = locationChoice
    rowsSheetsData: {},
    lastLocationUsed: null
  }),
})
