const url = require('url');

let collections = [];

// respondJSOn function - takes in a request, response, status, and object
// writes the response's head using the status code and headers json
// writes a stringified version of the object json to the response
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// responseJSONMeta function - takes in a request, response, and status code
// writes only a head to the response using the headers json and the status code
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

// notFound function - takes in a request and response
// creates a JSON with a message and id to indicate the page wasn't found
// passes the request and response to respondJSON with a 404 status code and 
// the responseJSON object
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

// notFoundMeta function - takes in a request and response
// passes the request and response to respondJSONMeta with a 404 status code
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

// getAmiibo function - takes in a request and response
// parses the request's url to get the query parameters
// adds the query parameters to the base url and performs
// a fetch request to amiibo api. Checks the returned json,
// if it is empty, calls respondJSON with a 400 status code and
// passes in a JSON with a message and id indicating no results
// otherwise, saves the returned amiibos in the searchedAmiibo array
// and constructs a responseJSON, then passing it to respondJSOn with a 200 status code
const getAmiibo = async (request, response) => {
  const startUrl = 'https://amiiboapi.com/api/amiibo';
  let searchUrl = '';

  let parsedUrl = url.parse(request.url);

  searchUrl = `${startUrl}?${parsedUrl.query}`;

  let apiResponse = await fetch(searchUrl);
  let obj = await apiResponse.json();

  if(obj.amiibo.length < 1) {
    const responseJSON = {
      message: 'No Results For The Search Queries',
      id: 'noResults',
    };
    return respondJSON(request, response, 400, responseJSON);
  }

  let returnedAmiibo = obj.amiibo;

  const responseJSON = {
    returnedAmiibo,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// getAmiiboMeta - takes in a request and response
// calls respondJSONMeta and passes the request, response, and
// a 200 status code
const getAmiiboMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

// getCollections - takes in a request and response
const getCollections = (request, response) => {
  const responseJSON = {
    collections,
  };

  return respondJSON(request, response, 200, responseJSON);
};


const getCollectionsMeta = (request, response) => {
  return respondJSONMeta(request, response, 200);
};

const addCollection = (request, response, body) => {
  const responseJSON = {
    message: 'A name is required.',
  };

  if(!body.collectionName) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  for(let c of collections) {
    if(c.name === body.collectionName) {
      responseJSON.message = 'A collection with this name already exists.';
      responseJSON.id = 'alreadyExists';
      return respondJSON(request, response, 400, responseJSON);
    }
  }

  let responseCode = 201;
  let collectionJSON = {
    'name': body.collectionName,
    'content': [],
  };
  collections.push(collectionJSON);

  responseJSON.message = 'Collection Created Successfully.';

  return respondJSON(request, response, responseCode, responseJSON);
};

// public exports
module.exports = {
  getAmiibo,
  getAmiiboMeta,
  getCollections,
  getCollectionsMeta,
  addCollection,
  notFound,
  notFoundMeta,
};
