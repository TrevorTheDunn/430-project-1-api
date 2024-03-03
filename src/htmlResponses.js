const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const collections = fs.readFileSync(`${__dirname}/../client/client2.html`);

// function to get the index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// function to get the collections page
const getCollections = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(collections);
  response.end();
};

// function to get css page
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// set our public exports
module.exports = {
  getIndex,
  getCollections,
  getCSS,
};
