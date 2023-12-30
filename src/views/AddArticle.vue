<template>
  <h1 class="mb-1">Ajouter un article</h1>

  <v-divider></v-divider>

  <br />

  <v-form @submit.prevent="addArticle">
    <v-row>
      <v-col cols="12" md="6">
        <v-radio-group v-model="addArticleForm.location" inline hide-details="auto">
          <v-radio v-for="location in locationChoices" :label="location.name" :value="location.name"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="addArticleForm.code"
          label="Code barre de l'article"
          type="text"
          :prepend-inner-icon="addArticleForm.code ? 'mdi-barcode' : 'mdi-barcode-scan'"
          @click:prependInner="showBarcodeScanner"
          @update:modelValue="setArticleCode"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card v-if="article">
          <v-card-title>{{ article['Désignation'] }}</v-card-title>
          <v-card-subtitle>{{ article['NomFournisseur'] }}</v-card-subtitle>
          <v-card-text>
            <p v-for="key in ['Poids', 'Nom Rayon', 'Nom Emplacement / sous-sol']">{{ key }} : {{ article[key] }}</p>
          </v-card-text>
        </v-card>
        <v-card v-if="!article">
          <v-card-text v-if="!addArticleForm.code">Scanner un article</v-card-text>
          <v-card-text v-if="addArticleForm.code">Pas trouvé...</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
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
      locationChoices: [],  // see init
      article: null,
      barcodeScanner: false,
      addSuccessMessage: false,
      loading: false
    }
  },
  mounted() {
    this.initAddArticleForm()
  },
  computed: {
    ...mapStores(useAppStore),
    formFilled() {
      return this.addArticleForm.location && this.addArticleForm.code
    }
  },
  methods: {
    initAddArticleForm(withSuccessMessage=false) {
      this.locationChoices = this.appStore.locationChoices
      this.addArticleForm.location = this.appStore.lastLocationUsed || this.locationChoices[0]['name']
      this.addArticleForm.code = null
      this.addArticleForm.quantity = 0
      this.article = null
      if (withSuccessMessage) {
        this.addSuccessMessage = true
      }
      setTimeout(() => {
        this.setArticleCode('3770019163078')
      }, 50)
    },
    showBarcodeScanner() {
      this.barcodeScanner = true
    },
    setArticleCode(code) {
      this.addArticleForm.code = code
      this.article = null
      this.article = api.getArticle(this.addArticleForm.location, code)
    },
    addArticle() {
      api.updateRowsSheetsData(this.addArticleForm.location, this.addArticleForm)
      .then((data) => {
        // this.$router.push({ path: '/', query: { addSuccess: 'true' } })
        this.initAddArticleForm(true)
      })
    }
  }
}
</script>
