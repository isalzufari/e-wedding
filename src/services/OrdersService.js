const NotFoundError = require('../exceptions/NotFoundError');
const pool = require('./SqlService');

class OrdersService {
  constructor() {
    this._pool = pool.promise();
  }

  async addOrders({ catalogueId, usersId, wedding_date }) {
    const query = {
      text: 'INSERT INTO orders (id_catalogues, id_users, wedding_date, status, created_at, updated_at) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())',
      values: [catalogueId, usersId, wedding_date, 0]
    };

    const [result] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.insertId) {
      throw new InvariantError('Katalog gagal ditambahkan: addCatalogues');
    }

    return result.insertId;
  }

  async putOrders({ wedding_date, ordersId }) {
    const query = {
      text: 'UPDATE `orders` SET wedding_date = ? WHERE id = ?',
      values: [wedding_date, ordersId],
    };

    await this._pool.query(
      query.text,
      query.values,
    );
  }

  async deleteOrders({ ordersId }) {
    const query = {
      text: 'DELETE FROM orders WHERE id = ?',
      values: [ordersId],
    };

    await this._pool.query(
      query.text,
      query.values,
    );
  }

  async changeStatusOrders({ updateStatus, ordersId }) {
    const query = {
      text: 'UPDATE `orders` SET status = ? WHERE id = ?',
      values: [updateStatus, ordersId],
    };

    await this._pool.query(
      query.text,
      query.values,
    );
  }

  async checkIsApprovedOrders({ ordersId }) {
    const query = {
      text: 'SELECT status FROM `orders` WHERE `id` = ?',
      values: [ordersId],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new NotFoundError('Pesanan tidak tersedia');
    }

    return result[0];
  }

  async getOrdersById({ ordersId }) {
    const query = {
      text: `SELECT 
      US.name, US.email, US.phone_number, OS.wedding_date, OS.status, CS.package_name, CS.price
      FROM orders AS OS
      INNER JOIN catalogues AS CS ON CS.id = OS.id_catalogues
      INNER JOIN users AS US ON US.id = OS.id_users
      WHERE OS.id = ?`,
      values: [ordersId],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new NotFoundError('Pesanan tidak tersedia!');
    }

    return result[0];
  }

  async getOrders() {
    const query = {
      text: `SELECT 
      OS.id, US.name, US.email, US.phone_number, OS.wedding_date, OS.status, CS.package_name, CS.price
      FROM orders AS OS
      INNER JOIN catalogues AS CS ON CS.id = OS.id_catalogues
      INNER JOIN users AS US ON US.id = OS.id_users`,
    };

    const [result, fields] = await this._pool.query(query.text);

    if (!result.length > 0) {
      throw new NotFoundError('Pesanan tidak tersedia!');
    }

    return result;
  }
}

module.exports = OrdersService;
