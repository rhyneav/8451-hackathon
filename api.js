const axios = require('axios');
const _ = require('lodash');
const express = require('express');
const CircularJSON = require('circular-json');
const router = express.Router();

const API_BASE_URL = 'https://www.kroger.com/'
const cookie = 'pid=eef850e7-b8ae-43f6-9603-b47cd031ed8a; AMCVS_371C27E253DB0F910A490D4E%40AdobeOrg=1; XSRF-TOKEN=e6b00a2d-c204-4f5b-bf48-5d569a865833; AMCV_371C27E253DB0F910A490D4E%40AdobeOrg=2096510701%7CMCIDTS%7C17405%7CMCMID%7C85891726627430617860105382948479529867%7CMCAID%7CNONE%7CMCOPTOUT-1503796123s%7CNONE%7CvVersion%7C2.0.0; s_vnum=1506364163360%26vn%3D6; sid=9634a597-2cb7-4946-acbc-b22d4c4c0c70; s_fid=51B3F94DA2937B1D-1683ABB5CBB30D09; DSLV=Sat%20Aug%2026%202017%2021%3A02%3A40%20GMT-0400%20(EDT); UMID=32cd8352-d884-4d4b-83ac-20bef050d6ce; loggedIn=yes; contextualized=ttffff; JSESSIONID=2FB2A476321EA60BD8BCF08FD4AB1E3A; ak_bmsc=BCF6BB88198DB3F899C8D183960B7FE617DC60044D790000521BA259A1E4737E~pl+NiF2QNIVRcyV62VEw3JiFCqs5BaZUEicBWO1d7HFEftVtSVe1vKGkGQ//Ka6fkYo+dxCgsZZ/5Ndd4VGT+yC588kfA6WxhiYNGRyNh0oaJ4VRzGq8W9aK1b65l1TbEUr64CzvBv5YaSIvFZq9LLzF7nXn+p9f1NC/0pX35fm343MXA2/ERgfXsbVhZl4RXppvYUiVmGIbA1GwhIUQ74PKDEGIIFHhPRV9s9i3XBGjY=; s_sq=%5B%5BB%5D%5D; s_cc=true; s_nr=1503796208334-Repeat; undefined_s=First%20Visit; s_invisit=true; bm_mi=B3880841C41019318D6C674EF23F2A36~mB9pI+hQawC+2CnvjwpwunBakT0JAIzdZGq1L7dtH8sOESmBmOIv5CObqRPE5yK7veHWhGULKAEAUMJ051lIrinmKvVDG7tfnSVExt3TjG8jTAZgV5gAjww1FAGKQmNNmGA6vI2aEQ7zOf1P2kewIaMw+jxVReJoyU7q5ohe4dHX7HmJm1KgvOzHcvQQVjhB3ujSfdWaVl3qE17npFa7z/pVJhHoGDhpRh2+P0Hul+YcPklpbcidcRJF6Uyg8TqQmKz3z4zw3kyABIn7lp1Y6A==; s_ppvl=%3F; dtSa=-; currentActiveListId=acb85b85-9e7f-421c-a0a2-672ea1516f2d; DivisionID=014; StoreCode=00929; StoreZipCode=45219; StoreLocalName=Kroger; StoreAddress=1%20West%20Corry%20Street%2C%20Cincinnati%2C%20OH; StoreInformation=1%20West%20Corry%20Street%2C%20Cincinnati%2C%20OH%2C5138721500%2C5138721520; dtLatC=2; dtCookie=6C501FA204D2F57556CFE2408E885BA3|QmFubmVyfDF8U2hvcHBpbmdMaXN0fDF8Q2xpY2tMaXN0V2VifDE; s_ppv=internal%2520search%2520results%253Aproducts%2C22%2C22%2C784%2C790%2C784%2C1600%2C900%2C1%2CP; __VCAP_ID__=038d000b-832f-4bf1-46c3-28e8b5f23346; aid=AC573A6D757B9D2C00BAA6F69BADA72F517B7CA4DF2BFD95E2276724ADE0B74D8FFC1B0A9B2FCBFC14E33A970B01BA3BEF3B730476D091BFA3173549FD7CFA73; aid_2=1503798011312|9634a597-2cb7-4946-acbc-b22d4c4c0c70; bannerRememberMe=187DCC2918F3D0C866BA37EF2674F534A4E0309C1809CF92D632C86D52F139F1A32C316769427748477F1806BA8439CE925EF61CD9EA047572FE0F8573FF9F6523A36586A30DC4FB53C3DFADFCC72085C91AD6BEDED64DE890F46150CACD160394B4A832AA79BD2952CA70C0ADC2EE9209365251F906CF0465DDA7D6EB6147621D819674D270CC5C89C7874076670694; bm_sv=FA6643F83A8CA7A183FB42A5C9679C54~QB3riFhGICFASqXSzWGvl/GHsDbk7W3Ul/UpFALK+KTd6+XKlKHwVhWeB8JR9pjhn6A0+3WibE9yejijkvK4VF1aE/A8hNd9G/lBpAjpaIZOK41LSXMQhO/2eIrJ5eoEt7CSm96bC4GLozQ0/koyIW4saPksC6ZB+U8PJJOQERg=; dtPC=196209095_554h23'

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
  const graphUrl = 'https://www.kroger.com/stores/api/graphql'
  const graphQuery = {"query":"query dropdownStoreSearch($searchText: String!) {\n  dropdownStoreSearch(searchText: $searchText) {\n    divisionNumber\n    vanityName\n    storeNumber\n    phoneNumber\n    showShopThisStoreAndPreferredStoreButtons\n    distance\n    address {\n      addressLine1\n      addressLine2\n      city\n      countryCode\n      stateCode\n      zip\n    }\n    hours {\n      sundayClose\n      sundayOpen\n      mondayClose\n      mondayOpen\n      tuesdayClose\n      tuesdayOpen\n      wednesdayClose\n      wednesdayOpen\n      thursdayClose\n      thursdayOpen\n      fridayClose\n      fridayOpen\n      saturdayClose\n      saturdayOpen\n    }\n  }\n}\n","variables":{"searchText": zip},"operationName":"dropdownStoreSearch"}

  axios.post(graphUrl, graphQuery, { headers: { cookie }}).then((data) => {
    const json = JSON.parse(CircularJSON.stringify(data))
    const stores = json.data.data.dropdownStoreSearch
    res.send(stores)
  })
})

module.exports = router;