const axios = require('axios');
const _ = require('lodash');
const express = require('express');
const CircularJSON = require('circular-json');
const router = express.Router();

const API_BASE_URL = 'https://www.kroger.com/'
const graphUrl = 'https://www.kroger.com/stores/api/graphql'
const cookie = 'pid=eef850e7-b8ae-43f6-9603-b47cd031ed8a; AMCVS_371C27E253DB0F910A490D4E%40AdobeOrg=1; XSRF-TOKEN=e6b00a2d-c204-4f5b-bf48-5d569a865833; AKA_A2=1; ak_bmsc=1F76D65D1038EE929298769F43B5C2A81737390D0A480000D644A259AE2AA967~plos5M/Dh3ilXVfiqxbjX5QOyXJ7aWgm5apbYB3cOZ4XYMXc0S6KnEP0OCYVMPsJjWxHepLHeBODVnlUE2CEHU01jB8SUVNuEXzIGpaQjL149qQW1MM0i9yaNc5IbuMijkEu/MP2+5XY5XyPRwErSI6UJUSNOsgJ0KTqxAD+FNlpyJoV0ZmUv9/nMafe1rYx9+TyXMb2easzw/ySt+cttPMplYFxW8FBCySKq/ow5CfHE=; sid=a261b97e-815e-4cdb-80be-5bb3cb68fa2c; s_vnum=1506364163360%26vn%3D9; UMID=e572c7e6-b729-4f93-bcde-7ffadd795898; AMCV_371C27E253DB0F910A490D4E%40AdobeOrg=2096510701%7CMCIDTS%7C17405%7CMCMID%7C85891726627430617860105382948479529867%7CMCAID%7CNONE%7CMCOPTOUT-1503813884s%7CNONE%7CvVersion%7C2.0.0; s_fid=51B3F94DA2937B1D-1683ABB5CBB30D09; DSLV=Sun%20Aug%2027%202017%2000%3A04%3A48%20GMT-0400%20(EDT); loggedIn=yes; contextualized=ttffff; JSESSIONID=27BB3F0C1A65BED5C82AF83B8DCF7601; currentActiveListId=acb85b85-9e7f-421c-a0a2-672ea1516f2d; DivisionID=014; StoreCode=00929; StoreZipCode=45219; StoreLocalName=Kroger; StoreAddress=1%20West%20Corry%20Street%2C%20Cincinnati%2C%20OH; StoreInformation=1%20West%20Corry%20Street%2C%20Cincinnati%2C%20OH%2C5138721500%2C5138721520; aid=AC573A6D757B9D2C00BAA6F69BADA72F517B7CA4DF2BFD95E2276724ADE0B74D17994416B5BE01F7D4BC9602A9E72519B51F7F6766BC5DF7F11F5BFC9815C11E; aid_2=1503808491670|a261b97e-815e-4cdb-80be-5bb3cb68fa2c; bannerRememberMe=B6B7CFCCF7FA469DE9FDB5FBCF7983F4AD4794AB688602D32093E39A2934DD179A66ABCD4F441E45393C133830228DE990BFE55C625221D4A0F8D22D5BC4FEF934D7EC77C5DB5B3C92749C01B1A9D0FD8EF249596509597AD34C2843B829CE027DF0BEBCFF3FBD02F4ABD667813EF693358C3BFB2BEAD8F0B6BB8F4E342AE2A5F9722DD29B4304F65513816E54F96ED0; s_ppvl=Kroger%2C100%2C100%2C784%2C790%2C784%2C1600%2C900%2C1%2CP; s_nr=1503806693072-Repeat; undefined_s=First%20Visit; s_invisit=true; s_cc=true; s_sq=krgrkrogerprod%252Ckrgrglobalprod%3D%2526c.%2526a.%2526activitymap.%2526page%253Dinternal%252520search%252520results%25253Aproducts%2526link%253D5%25252418.46%2526region%253Droot%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c%2526pid%253Dinternal%252520search%252520results%25253Aproducts%2526pidt%253D1%2526oid%253Dhttps%25253A%25252F%25252Fwww.kroger.com%25252Flist%2526ot%253DA; dtCookie=6C501FA204D2F57556CFE2408E885BA3|QmFubmVyfDF8U2hvcHBpbmdMaXN0fDF8Q2xpY2tMaXN0V2VifDE; __VCAP_ID__=dd0a2dba-e10b-4437-664b-76e3794fe10a; bm_mi=588EEE745132C9092C4059FEE69CE649~rTx1U6guf/0rcBFXbyegY8Et4GWQeGsPaLlZyZ4vEbVV/p0HN8wr+Cs1bdQgJooJ/Js9rKKWwDyD/mhznGD1LAZbdWC6O5vpeNZnLWq13XN5gdqebZnSjqgdQzVotTyGX0O5H5PTggm1HgLplOpYMf+kODn5eeZIFKDUws2lE8l4chxQhq1DYjp2CmKYO4uY1RhLMYgt+xB9JDThvd/HHoMN53z9NLay83Kj3bCQ+2M0xa2Wus8APLWiA8DIB8AsYw4Y2p3VSH2ydvOcwtmlZg==; s_ppv=internal%2520search%2520results%253Aproducts%2C19%2C19%2C784%2C790%2C331%2C1600%2C900%2C1%2CP; dtSa=-; dtLatC=39; bm_sv=9789E57F89B4190E046B789C84D0B3CE~X3LpsDI3eKzzB5SJY+3S9si1izMF4ruUrBGPXzzoFRMNBQSdXjwUB+80tM9rwCVKAAZZPSmqfcqMy9uamXDaT58S1j3ZrMieWQJ7yHvb96sdA/xP4YLPdsV07flqgbw05Rmu87xrRHp4s4MMpwTnKolX1DiUAhgGuR2y5wFzx4A=; dtPC=206863576_677h11'

router.get('/test', (req, res) => {
  const testData = {
    test: 'What what!!'
  }

  res.send(testData)
});
router.post('/search', (req, res) => {
  const { item } = req.body
  const encodedItem = encodeURIComponent(item)
  const searchUrl = `${API_BASE_URL}search/api/searchAll?start=0&count=4&query=${encodedItem}&tab=0`
  // Hit Kroger API
  axios.post(searchUrl, {}, { headers: { cookie }}).then((data) => {
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

    axios.get(aisleUrl).then((data) => {
      const json = JSON.parse(CircularJSON.stringify(data))
      const aisles = json.data
      const itemAisles = _.map(aisles, (aisle) => {
        return _.assign(aisle, _.find(itemArray, {upc: aisle.upc}));
      })

      res.send(itemAisles)
    })
  });
});

router.post('/stores', (req, res) => {
  const { zip } = req.body
  const graphQuery = {"query":"query dropdownStoreSearch($searchText: String!) {\n  dropdownStoreSearch(searchText: $searchText) {\n    divisionNumber\n    vanityName\n    storeNumber\n    phoneNumber\n    showShopThisStoreAndPreferredStoreButtons\n    distance\n    address {\n      addressLine1\n      addressLine2\n      city\n      countryCode\n      stateCode\n      zip\n    }\n    hours {\n      sundayClose\n      sundayOpen\n      mondayClose\n      mondayOpen\n      tuesdayClose\n      tuesdayOpen\n      wednesdayClose\n      wednesdayOpen\n      thursdayClose\n      thursdayOpen\n      fridayClose\n      fridayOpen\n      saturdayClose\n      saturdayOpen\n    }\n  }\n}\n","variables":{"searchText": zip},"operationName":"dropdownStoreSearch"}
  axios.post(graphUrl, graphQuery, { headers: { cookie }}).then((data) => {
    const json = JSON.parse(CircularJSON.stringify(data))
    const stores = json.data.data.dropdownStoreSearch
    res.send(stores)
  })
});

router.post('/change', (req, res) => {
  const { storeNumber, divisionNumber } = req.body
  const graphQuery = {"query":"mutation setPreferredStore($divisionNumber: String!, $storeNumber: String!) {\n  setPreferredStore(divisionNumber: $divisionNumber, storeNumber: $storeNumber) {\n    divisionNumber\n    storeNumber\n    vanityName\n    phoneNumber\n    latitude\n    longitude\n    brand\n    localName\n    address {\n      addressLine1\n      city\n      stateCode\n      zip\n    }\n    pharmacy {\n      phoneNumber\n      hours {\n        sundayClose\n        sundayOpen\n        mondayClose\n        mondayOpen\n        tuesdayClose\n        tuesdayOpen\n        wednesdayClose\n        wednesdayOpen\n        thursdayClose\n        thursdayOpen\n        fridayClose\n        fridayOpen\n        saturdayClose\n        saturdayOpen\n      }\n    }\n    hours {\n      sundayClose\n      sundayOpen\n      mondayClose\n      mondayOpen\n      tuesdayClose\n      tuesdayOpen\n      wednesdayClose\n      wednesdayOpen\n      thursdayClose\n      thursdayOpen\n      fridayClose\n      fridayOpen\n      saturdayClose\n      saturdayOpen\n    }\n    departments {\n      friendlyName\n    }\n    onlineServices {\n      name\n      url\n    }\n  }\n}\n","variables":{"storeNumber": storeNumber,"divisionNumber": divisionNumber},"operationName":"setPreferredStore"}
  axios.post(graphUrl, graphQuery, { headers: { cookie }}).then((data) => {
    const json = JSON.parse(CircularJSON.stringify(data))
    res.send({store: json.data})
  })
});

module.exports = router;