const routes = (handler) => [
  {
    method: 'POST',
    path: '/',
    handler: handler.postUserHandler,
  },
  {
    method: 'PUT',
    path: '/',
    handler: handler.putUserHandler,
    options: {
      auth: 'emading_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/',
    handler: handler.deleteUserHandler,
    options: {
      auth: 'emading_jwt'
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'emading_jwt'
    }
  }
];

module.exports = routes;
