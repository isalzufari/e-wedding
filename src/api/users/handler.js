class UsersHandler {
  constructor(service) {
    this._service = service;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.putUserHandler = this.putUserHandler.bind(this);
    this.deleteUserHandler = this.deleteUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    await this._service.addUser(request.payload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan!'
    });
    response.code(201);
    return response;
  }

  async putUserHandler(request, h) {
    const { id } = request.auth.credentials;
    const { name, email, password, phone_number } = request.payload;
    await this._service.editUser({ id, name, email, password, phone_number });

    return h.response({
      status: 'success',
      message: 'User berhasil diubah!'
    });
  }

  async deleteUserHandler(request, h) {
    const { id } = request.auth.credentials;
    await this._service.deleteUser({ id });

    return h.response({
      status: 'success',
      message: 'User berhasil dihapus!'
    });
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.auth.credentials;
    const user = await this._service.getUserById({ id });

    const response = h.response({
      status: 'success',
      data: user,
    });
    response.code(200);
    return response;
  }
}

module.exports = UsersHandler;
