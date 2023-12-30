<template>
  <h2 class="mb-1">
    🐘 Inventaire annuel {{ inventoryYear }} 🐘
  </h2>

  <br />

<v-btn class="mr-2 mb-2" color="primary" prepend-icon="mdi-plus" to="/add">Ajouter un article</v-btn>
<v-btn prepend-icon="mdi-google-spreadsheet" :href="rowsURL" target="_blank">Tableur partagé</v-btn>

<v-snackbar
    v-model="addSuccessMessage"
    color="success"
    :timeout="2000"
  >Article ajouté !</v-snackbar>
</template>

<script>
import { mapStores } from 'pinia'
import { useAppStore } from '../store/app'
import api from '../services/api'

export default {
  data() {
    return {
      inventoryYear: import.meta.env.VITE_INVETORY_YEAR,
      rowsURL: import.meta.env.VITE_ROWS_URL,
      // locationChoices: import.meta.env.VITE_INVENTORY_LOCATIONS.split(',')
      addSuccessMessage: false,
    }
  },
  mounted() {
    this.initData()
    if (this.$route.query.addSuccess === 'true') {
      this.addSuccessMessage = true
    }
  },
  computed: {
    ...mapStores(useAppStore),
  },
  methods: {
    initData() {
      this.appStore.inventoryYear = this.inventoryYear
      // this.appStore.locationChoices = this.locationChoices
      api.setRowsSheetsData()
    }
  }
}
</script>
