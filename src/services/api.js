import { useAppStore } from '../store/app'

const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets'


export default {
  getGoogleSheetsData(sheetName) {
    const store = useAppStore()
    const url = `${GOOGLE_SHEETS_API_URL}/${import.meta.env.VITE_GOOGLE_SHEETS_ID}/values/${sheetName}!A:Z?key=${import.meta.env.VITE_GOOGLE_SHEETS_API_KEY}&majorDimension=COLUMNS`
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
  },

  setGoogleSheetsData() {
    const store = useAppStore()
    store.locationChoices.forEach(location => {
      this.getGoogleSheetsData(location)
      .then(data => {
        store.googleSheetsData[location] = data['values']
      })
    })
  },

  getArticle(sheetName, articleCode) {
    const store = useAppStore()
    let articleList = store.googleSheetsData[sheetName][1] // column with numbers
    const articleIndex = articleList.findIndex(article => article == articleCode)
    if (articleIndex > -1) {
      let articleData = {}
      store.googleSheetsData[sheetName].forEach(column => {
        articleData[column[0]] = column[articleIndex]
      })
      return articleData
    }
    return null
  },

  updateGoogleSheetsData(sheetName, articleData) {
    const store = useAppStore()
    store.lastLocationUsed = sheetName
    // TODO
  }
}
