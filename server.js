const express = require('express');
const app = express();
const path = require('path');

//where we expose files or directories for public use
app.use(express.static(path.join(__dirname)));

//where we set our routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 3000);

/*var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);*/