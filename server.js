const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");

const port = process.env.PORT || 3000;

const api = require('./api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../cmc-frontend/dist')));

app.use('/api', api);

app.listen(port, () => {
  console.log('listenting on port', port);
});