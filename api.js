const axios = require('axios');
const _ = require('lodash');

const express = require('express');
const router = express.Router();

const KROGER_BASE_URL = "https://www.kroger.com/"

router.get('/test', (req, res) => {
  const testData = {
    test: 'What what!!'
  }

  res.send(testData)
});

router.post('/search', (req, res) => {
  const { item } = req.body
  const encodedItem = encodeURIComponent(item)
  const searchUrl = `${KROGER_BASE_URL}search/api/searchAll?start=0&count=24&query=${encodedItem}&tab=0`
  // Hit Kroger's API
  axios.post(searchUrl).then((data) => {
    res.send({ item: encodedItem })
  }).catch((error) => {
    res.send({ error })
  })
});

module.exports = router;