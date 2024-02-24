// list of users, is temporary so will be reset whenever the server is reset
const users = {};

const amiibo = {};
const collection = {};
const favorites = {};

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

// getUsers function - takes in a request and response
// constructs a responseJSON using the users list
// passes the request and response into respondJSON as well as
// a 200 status code and the responseJSON object
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// getUsersMeta function - takes in a request and response
// passes the request and response into respondJSONMeta with a 200 status code
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

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

// addUser function - takes in a request, response, and body
// determines if the body is missing a name or age and responds accordingly
// determines if the user is new or existing, and either updates the existing
// user or creates a new one and handles that accordingly
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const getAmiibo = async (request, response, body) => {
  const startUrl = 'https://amiiboapi.com/api/amiibo/';
  let parameters = '';
  let searchUrl = '';

  if(body.name) {
    parameters += `name=${body.name}`;
  }

  if(body.gameSeries) {
    if(parameters != '') { parameters += '&'; }
    parameters += `gameseries=${body.gameSeries}`;
  }

  if(body.amiiboSeries) {
    if(parameters != '') { parameters += '&'; }
    parameters += `amiiboSeries=${body.amiiboSeries}`;
  }

  if(body.type) {
    if(parameters != '') { parameters += '&'; }
    parameters += `type=${body.type}`;
  }

  if(parameters != '') {
    searchUrl = `${startUrl}?${parameters}`;
  } else {
    searchUrl = startUrl;
  }

  let apiResponse = await fetch(searchUrl);

  console.log(apiResponse);
};

// public exports
module.exports = {
  getAmiibo,
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  addUser,
};
