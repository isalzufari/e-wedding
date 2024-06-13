const CataloguesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'catalogues',
  version: '1.0.0',
  register: async (server, {
    cataloguesService,
    usersService
  }) => {
    const cataloguesHandler = new CataloguesHandler(
      cataloguesService,
      usersService
    );
    server.route(routes(cataloguesHandler));
  }
}