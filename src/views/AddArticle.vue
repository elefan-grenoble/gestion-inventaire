<template>
  <h1 class="mb-1">Ajouter un article</h1>

  <v-divider></v-divider>

  <br />

  <v-form @submit.prevent="addArticle">
    <v-row>
      <v-col cols="12" md="6">
        <v-radio-group v-model="addArticleForm.location" inline hide-details="auto">
          <v-radio v-for="location in locationChoices" :label="location" :value="location"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9">
        <v-text-field
          v-model="addArticleForm.code"
          label="Code barre de l'article"
          type="text"
          :prepend-inner-icon="addArticleForm.code ? 'mdi-barcode' : 'mdi-barcode-scan'"
          @click:prependInner="showBarcodeScanner"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="addArticleForm.quantity"
          label="Quantité en stock"
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-btn
      type="submit"
      class="mt-2"
      :color="formFilled ? 'primary' : 'default'"
      :loading="loading"
      :disabled="!formFilled"
    >Ajouter</v-btn>
  </v-form>

  <BarcodeScanner
    v-if="barcodeScanner"
    v-model="barcodeScanner"
    @barcode="setArticleCode($event)"
    @close="barcodeScanner = false"
  ></BarcodeScanner>
</template>

<script>
import BarcodeScanner from '../components/BarcodeScanner.vue'

export default {
  components: {
    BarcodeScanner,
  },
  data() {
    return {
      addArticleForm: {
        location: null,  // see init
        code: null,
        quantity: 0
      },
      locationChoices: import.meta.env.VITE_INVENTORY_LOCATIONS.split(','),
      barcodeScanner: false,
      loading: false
    }
  },
  mounted() {
    this.initAddArticleForm()
  },
  computed: {
    formFilled() {
      return this.addArticleForm.location && this.addArticleForm.code
    }
  },
  methods: {
    initAddArticleForm() {
      this.addArticleForm.location = import.meta.env.VITE_INVENTORY_LOCATIONS.split(',')[0]
    },
    showBarcodeScanner() {
      this.barcodeScanner = true
    },
    setArticleCode(code) {
      this.addArticleForm.code = code
    },
    addArticle() {
      console.log(this.addArticleForm)
      this.$router.push({ path: '/', query: { addSuccess: 'true' } })
    }
  }
}
</script>
