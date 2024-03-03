const http = require('http'); // pull in http module
// url module for parsing url string
const url = require('url');
// querystring module for parsing querystrings from url
const query = require('querystring');

// pull in our custom files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// urlStruct with Get and Head sections for different request methods,
// with the proper functions set for the proper urls
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/client.html': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/collections': htmlHandler.getCollections,
    '/client2.html': htmlHandler.getCollections,
    '/getAmiibo': jsonHandler.getAmiibo,
    '/getCollections': jsonHandler.getCollections,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getAmiibo': jsonHandler.getAmiiboMeta,
    '/getCollections': jsonHandler.getCollectionsMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

// parseBody function - takes in a request, response, and a handler function
// sets different functions for request actions, such as an error setting the
// response's status code to 404 and ending the response, data sending the
// chunk of data to the body, and when the request ends it parses the data
// of the body into parameters and sends them to the handler function
// with request and response
const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

// handlePost function: if the parsedUrl's pathname is /addUser,
// calls parseBody, passing in the addUser function from jsonHandler
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addCollection') {
    parseBody(request, response, jsonHandler.addCollection);
  } else if (parsedUrl.pathname === '/addAmiibo') {
    parseBody(request, response, jsonHandler.addAmiibo);
  } else if (parsedUrl.pathname === '/removeAmiibo') {
    parseBody(request, response, jsonHandler.removeAmiibo);
  }
};

// handleGet function: calls the method set in urlStruct under
// the request's method and the parsedUrl's pathname
// if the pathname doesn't exist, calls the notFound method
// under the request's method
const handleGet = (request, response, parsedUrl) => {
  if (urlStruct[request.method][parsedUrl.pathname]) {
    return urlStruct[request.method][parsedUrl.pathname](request, response);
  }

  return urlStruct[request.method].notFound(request, response);
};

// onRequest method: parses the request's url and calls either
// handlePost or handleGet depending on the request's method
const onRequest = (request, response) => {
  // parse url into individual parts
  // returns an object of url parts by name
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
