import { useAppStore } from '../store/app'

const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets'
const ROWS_API_URL = 'https://api.rows.com/v1/spreadsheets'
const WRITE_COLUMN_LETTER = 'H'


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

  getGoogleSheetsArticleIndex(sheetName, articleCode) {
    const store = useAppStore()
    let articleList = store.googleSheetsData[sheetName][1] // column with numbers
    return articleList.findIndex(article => article.replace == articleCode)
  },

  getArticle(sheetName, articleCode) {
    const store = useAppStore()
    const articleIndex = this.getGoogleSheetsArticleIndex(sheetName, articleCode)
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
    
    const articleIndex = this.getGoogleSheetsArticleIndex(sheetName, articleCode)

    const data = {
      'majorDimension': 'COLUMNS',
      'range': 'Magasin!A1:Z1430',
    }

    const url = `${GOOGLE_SHEETS_API_URL}/${import.meta.env.VITE_GOOGLE_SHEETS_ID}/values/${sheetName}!A:Z?key=${import.meta.env.VITE_GOOGLE_SHEETS_API_KEY}`
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
  },


  //////////////////////////////////////////////

  getRowsSheetsData(tableId) {
    const store = useAppStore()
    const url = `${ROWS_API_URL}/${import.meta.env.VITE_ROWS_SHEETS_ID}/tables/${tableId}/values/A:Z?major_dimension=COLUMN`
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_ROWS_API_KEY}`
      },
    })
    .then((response) => response.json())
  },

  setRowsSheetsData() {
    const store = useAppStore()
    store.locationChoices.forEach(location => {
      this.getRowsSheetsData(location.rows_table_id)
      .then(data => {
        store.rowsSheetsData[location.name] = data['items']
      })
    })
  },

  getRowsSheetsArticleIndex(sheetName, articleCode) {
    const store = useAppStore()
    // let articleList = store.rowsSheetsData[sheetName][0]
    // return articleList.findIndex(article => article.replace(',','') == articleCode)
    // let articleList = store.rowsSheetsData[sheetName][1] // column with numbers
    // return articleList.findIndex(article => article == articleCode)
    let articleList = store.rowsSheetsData[sheetName][1]
    return articleList.findIndex(article => article && article.startsWith(articleCode))
  },

  getArticle(sheetName, articleCode) {
    const store = useAppStore()
    const articleIndex = this.getRowsSheetsArticleIndex(sheetName, articleCode)
    if (articleIndex > -1) {
      let articleData = {}
      store.rowsSheetsData[sheetName].forEach(column => {
        articleData[column[0]] = column[articleIndex]
      })
      return articleData
    }
    return null
  },

  updateRowsSheetsData(sheetName, articleData) {
    const store = useAppStore()
    store.lastLocationUsed = sheetName
    
    const articleIndex = this.getRowsSheetsArticleIndex(sheetName, articleData.code)
    const location = store.locationChoices.find(l => l.name == sheetName)
    const range = `${WRITE_COLUMN_LETTER}${articleIndex+1}:${WRITE_COLUMN_LETTER}${articleIndex+1}`

    const data = {
      'cells': [
        [{'value': articleData.quantity}]
      ]
    }

    const url = `${ROWS_API_URL}/${import.meta.env.VITE_ROWS_SHEETS_ID}/tables/${location.rows_table_id}/cells/${range}`
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_ROWS_API_KEY}`
      },
      body: JSON.stringify(data),
    })
    .then((response) => response)
  },
}
