const routes = (handler) => [
  {
    method: 'POST',
    path: '/',
    handler: handler.postOrdersHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'PUT',
    path: '/{id}',
    handler: handler.putOrdersHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'DELETE',
    path: '/{id}',
    handler: handler.deleteOrdersHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'PUT',
    path: '/{id}/status',
    handler: handler.changeStatusOrdersHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'GET',
    path: '/{id}',
    handler: handler.getOrdersByIdHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: handler.getOrdersHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
];

module.exports = routes;
