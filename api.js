const axios = require('axios');
const _ = require('lodash');
const express = require('express');
const CircularJSON = require('circular-json');
const TWILIO_PHONE_NUMBER = '+19802555539'
const TWILIO_ACCOUNT_SID = 'ACbe338550ed0e3eb27225bd4673fe4ce8'
const TWILIO_AUTH_TOKEN = '8d88323b4e263b5e957ca1a34527f865'
var client = require('twilio')(
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN
);

const router = express.Router();

const API_BASE_URL = 'https://www.kroger.com/'
const graphUrl = 'https://www.kroger.com/stores/api/graphql'
const cookie = 'AKA_A2=1; sid=f6ba6536-c192-45cb-8b4d-53c0b88bc6b9; pid=4b29d8c3-ed43-4943-8928-e3a3ff60f819; AMCVS_371C27E253DB0F910A490D4E%40AdobeOrg=1; s_fid=5C310220757A8FC6-0A47DDA88D62D6A9; DSLV=Sun%20Aug%2027%202017%2001%3A40%3A26%20GMT-0400%20(EDT); loggedIn=yes; contextualized=ttffff; JSESSIONID=AAE86E700DB0DAE9A15F4C21EE823712; XSRF-TOKEN=3ea3f676-a81c-4da9-bf79-7415564cdbb7; s_sq=%5B%5BB%5D%5D; ak_bmsc=B0D6CD64CDE8A8AFC6BBD855D7078A151737390D0A480000EA97A2597DFDD66D~plarBSGEEoV13PeuZXwBVBWOy9pndwQUBB6Jdw1qKna0Y4+urATUKyv6gVlO4ldWsTPrFcRA6N8Ckce0cOYEZqbNfVSF/E/oRjTR5OQTLYo+87ZMpHl04ZZl/4YcTZg0ZQitrnUAZir53XQG541BtOwv6kVkzW6FNzad4p9ftldZlKmKDHXsXY6Ui2EC0SL0rl082SYSud7i8bt8izKw6O7KHK6wvqjporAXcsTe4OLqQ=; AKA_A2=1; AMCV_371C27E253DB0F910A490D4E%40AdobeOrg=2096510701%7CMCIDTS%7C17406%7CMCMID%7C79911161987480399246101558104136129012%7CMCAID%7CNONE%7CMCOPTOUT-1503835318s%7CNONE%7CvVersion%7C2.0.0; s_cc=true; dtCookie=6C501FA204D2F57556CFE2408E885BA3|U2hvcHBpbmdMaXN0fDF8QmFubmVyfDE; bm_mi=A4E93800B600375A1C7A38CE94B8DB86~mB9pI+hQawC+2Cnvjwpwuo2ULI8FtZh+XdModLsSTRowuaw/hykSSnCEiWp09V7WqQdYAU1XV+zx0hUfgmCjTi0CBM1TP+44SXQ3xqZ6d0C0O13gN1BUK6mf83RjAyKfRLB7gOb2QqQ87NsTDb4HLfQ6YITXkUZgXpTC+gVZlZ5apCuMr0GOa1Y2XQmJ6xnnI3z9jI9Umtmsu7G8pD8QGAgd6//HFMT4Op6+ezEYW00h34G/QHdQBLL1WA7Z6KHe94zHmdRJiIAf2O/zOjR8/w==; dtSa=-; dtLatC=29; DivisionID=014; StoreCode=00929; StoreZipCode=45219; StoreLocalName=Kroger; StoreAddress=1%20West%20Corry%20Street%2C%20Cincinnati%2C%20OH; StoreInformation=1%20West%20Corry%20Street%2C%20Cincinnati%2C%20OH%2C5138721500%2C5138721520; currentActiveListId=acb85b85-9e7f-421c-a0a2-672ea1516f2d; __VCAP_ID__=630bc773-6257-4dc6-5ea2-c502148700a7; aid=960728E4D6D18D8EAAFDF1B3EC06103211944A6F80B7EB6EE987B5F35EDED4235480C2CE4EF5115E231AEBCCF407E40C; aid_2=1503832584918|f6ba6536-c192-45cb-8b4d-53c0b88bc6b9; bannerRememberMe=187DCC2918F3D0C866BA37EF2674F534A4E0309C1809CF92D632C86D52F139F1A32C316769427748477F1806BA8439CE925EF61CD9EA047572FE0F8573FF9F652AB476CE442392A5F1C941282ED8DB1A01817148E56C2D9F4A5974A566AC20F1F16C9467AB4F622871D16F97EFAFD71093F932EF0CD62F710FDB838B76A60A48E7BEA430BA5BB7226FE19F02664CD426; bm_sv=62F4ABC421FA93A8F0DF7A1F084E72F4~QB3riFhGICFASqXSzWGvlzNxCkYpXGBG1DjBCXitbZ4HnfsQNQIV18SyweWutqWnQgFNqm2KUbY7if9xCl6ZtOL74xFDxhPvkga8Snby978yepQD8Pp5ydyL/wM3IfLh9a1Q95juYdPD1wWvgwwE+62SvGUwoypsyBY+Z7fdJPg=; s_nr=1503830786831-Repeat; undefined_s=First%20Visit; s_vnum=1506404416325%26vn%3D5; s_invisit=true; s_ppvl=list%2C20%2C20%2C331%2C790%2C331%2C1600%2C900%2C1%2CP; s_ppv=list%2C73%2C73%2C908%2C1600%2C351%2C1600%2C900%2C1%2CP; dtPC=230782575_725h24'
const API_AI_URL = 'https://api.api.ai/v1/query?v=20150910&access_token=81c32062f9ab42998124e519e4908feb'

const TYPES = {
  find: 'provide_aisle',
  add: 'Add.Item',
  list: 'show.list',
  change: 'change_store',
  unknown: 'input.unknown'
}

router.get('/test', (req, res) => {
  const testData = {
    test: 'What what!!'
  }
  res.send(testData)
});

function sendMessage(to, message) {
  console.log(message)
  client.messages.create({
    from: TWILIO_PHONE_NUMBER,
    to: to,
    body: message
  }, function(err, message) {
    if(err) {
      console.error(err.message);
    }
  });
}

router.post('/text', (req, res) => {
  console.log(req.body)
  const query = req.body.Body
  const from = req.body.From

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
      console.log('LIST')
      listController(req, res)
    } else if (action == TYPES.change) {
      console.log('CHANGE')
      const zip = json.data.result.resolvedQuery.replace( /^\D+/g, '');
      req.body.zip = zip
      storesController(req, res)
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
    const upcArray = _.map(products, (product) => {
      return product['upc']
    })
    const itemArray = _.map(products, (product) => {
      return _.pick(product, ['upc', 'description'])
    })
    const upcList = upcArray.toString()
    const aisleUrl = `${API_BASE_URL}api/shoppinglist/item/aisle?upcs=${upcList}&divisionNumber=014&storeNumber=00929`
    console.log(aisleUrl)
    axios.get(aisleUrl, { headers: { cookie }}).then((data) => {
      const json = JSON.parse(CircularJSON.stringify(data))
      const aisles = json.data
      console.log(aisles)
      const itemAisles = _.map(aisles, (aisle) => {
        return _.assign(aisle, _.find(itemArray, { upc: aisle.upc }));
      })
      const location = itemAisles[0]['aisleDescription']
      const message = `The ${item} are located in ${location}`
      sendMessage('+16145582816', message)
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
    const { storeNumber, divisionNumber } = stores[0]
    console.log(storeNumber, divisionNumber)
    req.body.storeNumber = storeNumber
    req.body.divisionNumber = divisionNumber
    changeController(req, res)
    // res.send(stores)
  }).catch((error) => {
    res.send({ error })
  });
}

router.post('/change', changeController);

function changeController(req, res) {
  const { storeNumber, divisionNumber } = req.body
  const { zip } = req.body
  const graphQuery = { "query": "mutation setPreferredStore($divisionNumber: String!, $storeNumber: String!) {\n  setPreferredStore(divisionNumber: $divisionNumber, storeNumber: $storeNumber) {\n    divisionNumber\n    storeNumber\n    vanityName\n    phoneNumber\n    latitude\n    longitude\n    brand\n    localName\n    address {\n      addressLine1\n      city\n      stateCode\n      zip\n    }\n    pharmacy {\n      phoneNumber\n      hours {\n        sundayClose\n        sundayOpen\n        mondayClose\n        mondayOpen\n        tuesdayClose\n        tuesdayOpen\n        wednesdayClose\n        wednesdayOpen\n        thursdayClose\n        thursdayOpen\n        fridayClose\n        fridayOpen\n        saturdayClose\n        saturdayOpen\n      }\n    }\n    hours {\n      sundayClose\n      sundayOpen\n      mondayClose\n      mondayOpen\n      tuesdayClose\n      tuesdayOpen\n      wednesdayClose\n      wednesdayOpen\n      thursdayClose\n      thursdayOpen\n      fridayClose\n      fridayOpen\n      saturdayClose\n      saturdayOpen\n    }\n    departments {\n      friendlyName\n    }\n    onlineServices {\n      name\n      url\n    }\n  }\n}\n", "variables": { "storeNumber": storeNumber, "divisionNumber": divisionNumber }, "operationName": "setPreferredStore" }
  axios.post(graphUrl, graphQuery, { headers: { cookie } }).then((data) => {
    const json = JSON.parse(CircularJSON.stringify(data))
    const location = json.data.data.setPreferredStore.vanityName
    sendMessage("+16145582816", `Store changed to ${location}`)
    res.send({ store: json.data })
  }).catch((error) => {
    res.send({ error })
  });
}

router.get('/list', listController)

function listController(req, res) {
  const url = 'https://www.kroger.com/api/shoppinglist/list/acb85b85-9e7f-421c-a0a2-672ea1516f2d/'
  axios.get(url, { headers: { cookie, accept: '*/*' } }).then((data) => {
    console.log(data)
    const json = JSON.parse(CircularJSON.stringify(data))
    const { items } = json.data
    const itemsList = _.map(items, (item) => {
      return ` ${item['quantity']}x ${item['displayName']}`
    })
    const message = 'Your list is' + itemsList.toString()
    sendMessage('+16145582816', message)
    res.send(itemsList)
  }).catch((error) => {
    res.send({ error })
  });
}

module.exports = router;