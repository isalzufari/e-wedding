class CataloguesHandler {
  constructor(cataloguesService, ordersService, usersService,) {
    this._cataloguesService = cataloguesService;
    this._ordersService = ordersService;
    this._usersService = usersService;

    this.postOrdersHandler = this.postOrdersHandler.bind(this);
    this.putOrdersHandler = this.putOrdersHandler.bind(this);
    this.deleteOrdersHandler = this.deleteOrdersHandler.bind(this);
    this.changeStatusOrdersHandler = this.changeStatusOrdersHandler.bind(this);
    this.getOrdersByIdHandler = this.getOrdersByIdHandler.bind(this);
    this.getOrdersHandler = this.getOrdersHandler.bind(this);
  }

  async postOrdersHandler(request, h) {
    const { id: usersId } = request.auth.credentials;
    const { catalogueId, wedding_date } = request.payload;

    const ordersId = await this._ordersService.addOrders({
      usersId, catalogueId, wedding_date
    });

    const response = h.response({
      status: 'success',
      message: 'Orders berhasil ditambahkan!',
      data: {
        ordersId
      }
    });
    response.code(201);
    return response;
  }

  async putOrdersHandler(request, h) {
    const { id: usersId } = request.auth.credentials;
    const { id: ordersId } = request.params;
    const { wedding_date } = request.payload;

    await this._ordersService.putOrders({
      wedding_date, ordersId
    });

    return {
      status: 'success',
      message: 'Orders berhasil diubah!',
    }
  }

  async deleteOrdersHandler(request, h) {
    const { id: usersId } = request.auth.credentials;
    const { id: ordersId } = request.params;

    await this._ordersService.deleteOrders({ ordersId });

    return {
      status: 'success',
      message: 'Orders berhasil dihapus!',
    }
  }

  async changeStatusOrdersHandler(request, h) {
    const { id: usersId } = request.auth.credentials;
    const { id: ordersId } = request.params;

    await this._usersService.verifyIsAdmin({ usersId });
    const { status } = await this._ordersService.checkIsApprovedOrders({ ordersId });
    const updateStatus = status === 0 ? 1 : 0;

    await this._ordersService.changeStatusOrders({ updateStatus, ordersId });

    return {
      status: 'success',
      message: 'Status orders berhasil diubah!',
    }
  }

  async getOrdersByIdHandler(request, h) {
    const { id: usersId } = request.auth.credentials;
    const { id: ordersId } = request.params;

    const data = await this._ordersService.getOrdersById({ ordersId });

    return {
      status: 'success',
      data
    }
  }

  async getOrdersHandler(request, h) {
    const { id: usersId, isAdmin = null } = request.auth.credentials;

    let data;
    if (isAdmin) {
      data = await this._ordersService.adminGetOrders();
    } else {
      data = await this._ordersService.getOrders({ usersId });
    }

    return {
      status: 'success',
      data
    }
  }
}

module.exports = CataloguesHandler;
