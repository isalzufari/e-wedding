const routes = (handler) => [
  {
    method: 'POST',
    path: '/',
    handler: handler.postCataloguesHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'PUT',
    path: '/{id}',
    handler: handler.putCataloguesHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'DELETE',
    path: '/{id}',
    handler: handler.deleteCataloguesHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'PUT',
    path: '/{id}/status',
    handler: handler.putCataloguesStatusHandler,
    options: {
      auth: 'emading_jwt'
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: handler.getCataloguesHandler,
    options: {
      auth: {
        strategy: 'emading_jwt',
        mode: 'optional'
      }
    },
  },
  {
    method: 'GET',
    path: '/{slug}',
    handler: handler.getCataloguesBySlugHandler,
  },
  {
    method: 'GET',
    path: '/{id}/admin',
    handler: handler.getCataloguesByIdHandler,
  },
]

module.exports = routes;
