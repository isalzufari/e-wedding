const OrdersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'orders',
  version: '1.0.0',
  register: async (server, {
    cataloguesService,
    ordersService,
    usersService,
  }) => {
    const ordersHandler = new OrdersHandler(
      cataloguesService,
      ordersService,
      usersService,
    );
    server.route(routes(ordersHandler));
  }
}