<template>
  <h1 class="mb-1">
    🐘 Inventaire annuel {{ inventoryYear }} 🐘
  </h1>

  <br />

<v-btn prepend-icon="mdi-plus" to="/add">Ajouter un article</v-btn>
</template>

<script>
import { mapStores } from 'pinia'
import { useAppStore } from '../store/app'
import api from '../services/api'

export default {
  data() {
    return {
      inventoryYear: import.meta.env.VITE_INVETORY_YEAR,
      locationChoices: import.meta.env.VITE_INVENTORY_LOCATIONS.split(',')
    }
  },
  mounted() {
    this.initData()
  },
  computed: {
    ...mapStores(useAppStore),
  },
  methods: {
    initData() {
      this.appStore.inventoryYear = this.inventoryYear
      this.appStore.locationChoices = this.locationChoices
      api.setGoogleSheetsData()
    }
  }
}
</script>
