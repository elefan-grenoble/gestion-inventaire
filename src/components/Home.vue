<template>
  <h1 class="mb-1">🐘 Inventaire annuel {{ inventoryYear }} 🐘</h1>
</template>

<script>
export default {
  data() {
    return {
      inventoryYear: import.meta.env.VITE_INVETORY_YEAR,
    }
  }
}
</script>
