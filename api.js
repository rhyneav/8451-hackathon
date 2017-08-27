const axios = require('axios');
const _ = require('lodash');
const express = require('express');
const CircularJSON = require('circular-json');
const router = express.Router();

const API_BASE_URL = 'https://www.kroger.com/'
const graphUrl = 'https://www.kroger.com/stores/api/graphql'
const cookie = 'sid=f6ba6536-c192-45cb-8b4d-53c0b88bc6b9; pid=4b29d8c3-ed43-4943-8928-e3a3ff60f819; AMCVS_371C27E253DB0F910A490D4E%40AdobeOrg=1; s_fid=5C310220757A8FC6-0A47DDA88D62D6A9; DSLV=Sun%20Aug%2027%202017%2001%3A40%3A26%20GMT-0400%20(EDT); loggedIn=yes; contextualized=ttffff; JSESSIONID=AAE86E700DB0DAE9A15F4C21EE823712; s_vnum=1506404416325%26vn%3D3; AMCV_371C27E253DB0F910A490D4E%40AdobeOrg=2096510701%7CMCIDTS%7C17406%7CMCMID%7C79911161987480399246101558104136129012%7CMCAID%7CNONE%7CMCOPTOUT-1503827567s%7CNONE%7CvVersion%7C2.0.0; AKA_A2=1; XSRF-TOKEN=3ea3f676-a81c-4da9-bf79-7415564cdbb7; bm_mi=12FD159F8086D9F2FE72774815D16E24~mB9pI+hQawC+2Cnvjwpwut702YXTk3P19dgBrDGFMcReCHQXVi2AEitmGY8YP/I48uACx5jiXjWiIg2D+q5MTNWNTQfD1rj7TiOaOsaAUqOP9+HJxJhipEREezvzNq66JTndDOLQ3s3NT141zc8bDf62wuuztxYiCrQBLRtVdWP4Z1JH7IgKIxhb41/Z8h4qmS/NQ90HNpR7VBVSLOfXA8JB8idq5eHlKrZH1ZOWffECON+QDbA7kwbnF6iBImWslkaSPRqYstiCtD6zoilPjw==; bm_sv=AEEA8BDD7E606625E265E75D75624257~QB3riFhGICFASqXSzWGvl6ojtI0cJkkazd8krvup/rlR1R18CoX5t/qglaXqkl2ci0zS1+DYBm2U+MsbZ/ppCyYyl+hdkPahkwxjxGFxh1AygjIcZ4B736sFzZN4wHT9VShV9K1QXx100s48GJBKqLK5BJOCcO2+G/AOh6z5ZVg=; ak_bmsc=8901E0518A923B1999AC6C5E5D1D730817DC60044D7900004A7AA259EB8D8374~pl0kBbPkZDsZn5d1G3GETwlEQWFRXPktYFCgqrlHCrPfLhKQ3JX4Iw8ItpWkmozvUpuAJwQlCGIH9kHwszq2cd189iqdoR6ssLZ++BdNIq/lxYBTfi5VvVYh7s73qx7VVSNJ0SSnkPP/2IrhGuIzfKyKRpFlolMsBnwkpanWpwTyAbhY5W+xJ89o2JJMpvwUu0ySIDXkI0bVaWl+7qzbbY93fIVBMhFguQlFknIcHGJURrO5biCuzfFJ2MvyLIEG2AbvwsAlTDu+EfObWeWi2zDQ==; dtSa=-; s_cc=true; DivisionID=014; StoreCode=00929; StoreZipCode=45219; StoreLocalName=Kroger; StoreAddress=1%20West%20Corry%20Street%2C%20Cincinnati%2C%20OH; StoreInformation=1%20West%20Corry%20Street%2C%20Cincinnati%2C%20OH%2C5138721500%2C5138721520; bannerRememberMe=187DCC2918F3D0C866BA37EF2674F534A4E0309C1809CF92D632C86D52F139F1A32C316769427748477F1806BA8439CE925EF61CD9EA047572FE0F8573FF9F651FF73586B7D4D95FBE06DB60B0C78174ABE674BB156FFFD39D84FA8A3AF86E0810AD5848303804FD23E99004507E2AE00342B00BC780BFB7360846163BC288D41F34B8B4F97BC974AF4931052D5D4444; currentActiveListId=acb85b85-9e7f-421c-a0a2-672ea1516f2d; s_nr=1503823924246-Repeat; undefined_s=First%20Visit; s_invisit=true; s_sq=%5B%5BB%5D%5D; dtLatC=2; dtPC=-; dtCookie=6C501FA204D2F57556CFE2408E885BA3|U2hvcHBpbmdMaXN0fDF8QmFubmVyfDE; __VCAP_ID__=fd4e796f-57db-4ef2-7450-f6b9e0082923; aid=960728E4D6D18D8EAAFDF1B3EC06103211944A6F80B7EB6EE987B5F35EDED4232C4CD48FB31B02A88D199ADFE2EE804D; aid_2=1503825778445|f6ba6536-c192-45cb-8b4d-53c0b88bc6b9; s_ppvl=list%2C20%2C20%2C331%2C790%2C331%2C1600%2C900%2C1%2CP; s_ppv=www.kroger.com%2C19%2C19%2C331%2C790%2C331%2C1600%2C900%2C1%2CP'
const API_AI_URL = 'https://api.api.ai/v1/query?v=20150910&access_token=81c32062f9ab42998124e519e4908feb'

const TYPES = {
  find: 'provide_aisle',
  add: 'Add.Item',
  list: 'show.list',
  unknown: 'input.unknown'
}

router.get('/test', (req, res) => {
  const testData = {
    test: 'What what!!'
  }
  res.send(testData)
});

router.post('/text', (req, res) => {
  const { query } = req.body
  const body = { query, lang: 'en', sessionId: 1234567890 }
  axios.post(API_AI_URL, body, { headers: { 'Content-Type': 'application/json', 'Authorization': '81c32062f9ab42998124e519e4908feb' } }).then((data) => {
    // console.log(data)
    const json = JSON.parse(CircularJSON.stringify(data))
    const { action } = json.data.result
    console.log(action, ":::", TYPES)
    if (action == TYPES.find) {
      console.log('FIND')
      const item = json.data.result.parameters.Item
      req.body.item = item
      searchController(req, res)
    } else if (action == TYPES.add) {
      console.log('ADD')
      res.send({ text: 'texttdsx' })
    } else if (action == TYPES.list) {
      listController(req, res)
    } else {
      res.send({ error: 'Sorry, I do not know what that means. Try typing "find bananas" instead!' })
    }
  }).catch((error) => {
    // console.log(error)
    const json = JSON.parse(CircularJSON.stringify(error))
    res.send({ error: json.data })
  })
})

router.post('/add', (req, res) => {
  // const { item } = req.body
  // const encodedItem = encodeURIComponent(item)
  // const searchUrl = `${API_BASE_URL}search/api/searchAll?start=0&count=4&query=${encodedItem}&tab=0`
  // axios.post(searchUrl, {}, { headers: { cookie } }).then((data) => {
  //   const json = JSON.parse(CircularJSON.stringify(data))
  //   const { products } = json.data
    const addUrl = 'https://www.kroger.com/api/shoppinglist/list/acb85b85-9e7f-421c-a0a2-672ea1516f2d/bulk'
  //   // console.log(products[0])
  //   const displayName = products[0]['description']
  //   const upc = products[0]['upc']
  //   const listPrice = products[0]['price']
  //   const sourceMap = { seamless: upc }
  //   const body = { adds: [{ productName, upc, listPrice, sourceMap, quantity: 1 }] }
    const test = {
	"adds": [
		{"displayName":"LOL KROGER - YOU ARE SILLY","upc":"0000000004011","productUpc":"0000000004011","pdpLink":"/p/banana/0000000004011","quantity":1,"productName":"Banana","listPrice":0.27,"yellowTag":false,"yellowTagDetails":null,"couponId":null,"couponCategory":null,"hasCoupon":false,"clicklistEligible":true,"productCategory":"36","itemIndex":"1","favoriteProduct":true,"componentName":"internal search","isUpdating":false,"persistedQuantity":0,"sourceMap":{"seamless":"0000000004011"}}
	]
}
    axios.post(addUrl, test, { headers: { cookie } }).then((data) => {
      const json = JSON.parse(CircularJSON.stringify(error))
      console.log(json.data)
      res.send(products[0])
    }).catch(err => res.send(err))
  //   // res.send(products[0])
  // }).catch((error) => {
  //   res.send({ error })
  // })
})

router.post('/search', searchController);

function searchController(req, res) {
  const { item } = req.body
  const encodedItem = encodeURIComponent(item)
  const searchUrl = `${API_BASE_URL}search/api/searchAll?start=0&count=4&query=${encodedItem}&tab=0`
  // Hit Kroger API
  axios.post(searchUrl, {}, { headers: { cookie } }).then((data) => {
    // Because axios is a silly head and I'm too tired to 
    // Figure out a proper solution to Axios' Circular bullshit
    const json = JSON.parse(CircularJSON.stringify(data))
    const { products } = json.data
    console.log(products)
    const upcArray = _.map(products, (product) => {
      return product['upc']
    })
    const itemArray = _.map(products, (product) => {
      return _.pick(product, ['upc', 'description'])
    })
    const upcList = upcArray.toString()
    const aisleUrl = `${API_BASE_URL}api/shoppinglist/item/aisle?upcs=${upcList}&divisionNumber=014&storeNumber=00929`

    axios.get(aisleUrl).then((data) => {
      const json = JSON.parse(CircularJSON.stringify(data))
      const aisles = json.data
      const itemAisles = _.map(aisles, (aisle) => {
        return _.assign(aisle, _.find(itemArray, { upc: aisle.upc }));
      })

      res.send(itemAisles)
    })
  }).catch((error) => {
    res.send({ error })
  });
}

router.post('/stores', storesController);

function storesController(req, res) {
  const { zip } = req.body
  const graphQuery = { "query": "query dropdownStoreSearch($searchText: String!) {\n  dropdownStoreSearch(searchText: $searchText) {\n    divisionNumber\n    vanityName\n    storeNumber\n    phoneNumber\n    showShopThisStoreAndPreferredStoreButtons\n    distance\n    address {\n      addressLine1\n      addressLine2\n      city\n      countryCode\n      stateCode\n      zip\n    }\n    hours {\n      sundayClose\n      sundayOpen\n      mondayClose\n      mondayOpen\n      tuesdayClose\n      tuesdayOpen\n      wednesdayClose\n      wednesdayOpen\n      thursdayClose\n      thursdayOpen\n      fridayClose\n      fridayOpen\n      saturdayClose\n      saturdayOpen\n    }\n  }\n}\n", "variables": { "searchText": zip }, "operationName": "dropdownStoreSearch" }
  axios.post(graphUrl, graphQuery, { headers: { cookie } }).then((data) => {
    const json = JSON.parse(CircularJSON.stringify(data))
    const stores = json.data.data.dropdownStoreSearch
    res.send(stores)
  }).catch((error) => {
    res.send({ error })
  });
}

router.post('/change', (req, res) => {
  const { storeNumber, divisionNumber } = req.body
  const graphQuery = { "query": "mutation setPreferredStore($divisionNumber: String!, $storeNumber: String!) {\n  setPreferredStore(divisionNumber: $divisionNumber, storeNumber: $storeNumber) {\n    divisionNumber\n    storeNumber\n    vanityName\n    phoneNumber\n    latitude\n    longitude\n    brand\n    localName\n    address {\n      addressLine1\n      city\n      stateCode\n      zip\n    }\n    pharmacy {\n      phoneNumber\n      hours {\n        sundayClose\n        sundayOpen\n        mondayClose\n        mondayOpen\n        tuesdayClose\n        tuesdayOpen\n        wednesdayClose\n        wednesdayOpen\n        thursdayClose\n        thursdayOpen\n        fridayClose\n        fridayOpen\n        saturdayClose\n        saturdayOpen\n      }\n    }\n    hours {\n      sundayClose\n      sundayOpen\n      mondayClose\n      mondayOpen\n      tuesdayClose\n      tuesdayOpen\n      wednesdayClose\n      wednesdayOpen\n      thursdayClose\n      thursdayOpen\n      fridayClose\n      fridayOpen\n      saturdayClose\n      saturdayOpen\n    }\n    departments {\n      friendlyName\n    }\n    onlineServices {\n      name\n      url\n    }\n  }\n}\n", "variables": { "storeNumber": storeNumber, "divisionNumber": divisionNumber }, "operationName": "setPreferredStore" }
  axios.post(graphUrl, graphQuery, { headers: { cookie } }).then((data) => {
    const json = JSON.parse(CircularJSON.stringify(data))
    res.send({ store: json.data })
  }).catch((error) => {
    res.send({ error })
  });
});

router.get('/list', listController)

function listController(req, res) {
  const url = 'https://www.kroger.com/api/shoppinglist/list/acb85b85-9e7f-421c-a0a2-672ea1516f2d/'
  axios.get(url, { headers: { cookie, accept: '*/*' } }).then((data) => {
    console.log(data)
    const json = JSON.parse(CircularJSON.stringify(data))
    const { items } = json.data
    const itemsList = _.map(items, (item) => {
      return _.pick(item, ['displayName', 'quantity'])
    })
    res.send(itemsList)
  }).catch((error) => {
    res.send({ error })
  });
}

module.exports = router;