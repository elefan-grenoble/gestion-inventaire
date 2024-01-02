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
    let articleList = store.googleSheetsData[sheetName][import.meta.env.VITE_ROWS_COLUMN_ARTICLE_CODE_INDEX]
    return articleList.findIndex(article => article == articleCode)
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
  // 1) getRowsSheetsData & setRowsSheetsData
  // 2) user starts typing a code (or scans) : getArticleListByCode
  // 3) user found corresponding article (1 matching code) : getRowsSheetsArticleIndex & updateRowsSheetsData

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

  getRowsSheetsArticleCodeMatched(sheetName, articleCode) {
    const store = useAppStore()
    let articleCodeList = store.rowsSheetsData[sheetName][import.meta.env.VITE_ROWS_COLUMN_ARTICLE_CODE_INDEX]
    let articleCodeCleaned = parseInt(articleCode).toString()  // remove 0 padding
    return articleCodeList.filter(article => article && article.startsWith(articleCodeCleaned))
  },

  getRowsSheetsArticleIndex(sheetName, articleCode) {
    const store = useAppStore()
    let articleList = store.rowsSheetsData[sheetName][import.meta.env.VITE_ROWS_COLUMN_ARTICLE_CODE_INDEX]
    let articleCodeCleaned = parseInt(articleCode).toString()  // remove 0 padding
    return articleList.findIndex(article => article && article.startsWith(articleCodeCleaned))  // article.replace(',','')
  },

  getArticleObjectFromIndex(sheetName, articleIndex) {
    const store = useAppStore()
    let articleData = {}
    store.rowsSheetsData[sheetName].forEach(column => {
      articleData[column[0]] = column[articleIndex]
    })
    return articleData
  },

  getArticleListByCode(sheetName, articleCode) {
    const articleCodeMatched = this.getRowsSheetsArticleCodeMatched(sheetName, articleCode)
    let articleObjectList = []
    articleCodeMatched.forEach((articleCode) => {
      const articleIndex = this.getRowsSheetsArticleIndex(sheetName, articleCode)
      if (articleIndex > -1) {
        articleObjectList.push(this.getArticleObjectFromIndex(sheetName, articleIndex))
      }
    })
    return articleObjectList
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
