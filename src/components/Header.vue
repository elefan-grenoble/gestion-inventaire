<template>
  <v-app-bar :elevation="1">
    <v-app-bar-title style="cursor:pointer" @click="$router.push('/')">Inventaire</v-app-bar-title>
    <template v-slot:append>
      <v-btn to="/add" prepend-icon="mdi-plus">Ajouter</v-btn>
    </template>
  </v-app-bar>
</template>

<script>
</script>
