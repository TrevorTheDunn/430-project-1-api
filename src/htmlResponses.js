const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const collection = fs.readFileSync(`${__dirname}/../client/client2.html`);

// function to get the index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCollection = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(collection);
  response.end();
}

// function to get css page
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// set our public exports
module.exports = {
  getIndex,
  getCollection,
  getCSS,
};
