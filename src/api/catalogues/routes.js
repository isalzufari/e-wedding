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
    method: 'GET',
    path: '/{slug}',
    handler: handler.getCataloguesBySlugHandler,
  },
  {
    method: 'GET',
    path: '/',
    handler: handler.getCataloguesHandler,
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
]

module.exports = routes;
