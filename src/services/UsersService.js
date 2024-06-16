const pool = require('./SqlService');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = pool.promise();
  }

  async getUserById({ id }) {
    const query = {
      text: 'SELECT name, email, phone_number, isAdmin FROM `users` WHERE `id` = ?',
      values: [id],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    return result[0];
  }

  async addUser({ name, email, password, phone_number }) {
    await this.verifyNewEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users (name, email, password, phone_number, isDeleted, isAdmin, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())',
      values: [name, email, hashedPassword, phone_number, 0, 0],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.insertId) {
      throw new InvariantError('User gagal ditambahkan: addUser');
    }

    return result.insertId;
  }

  async editUser({ id, name, email, password, phone_number }) {
    await this.verifyUserCredential({ email, password });

    const query = {
      text: 'UPDATE users SET name = ?, phone_number = ?, updated_at = CURRENT_TIMESTAMP() WHERE id = ?',
      values: [name, phone_number, id],
    };

    await this._pool.query(
      query.text,
      query.values,
    );
  }

  async deleteUser({ id }) {
    const query = {
      text: 'UPDATE users SET isDeleted = 1 WHERE id = ?',
      values: [id],
    };

    await this._pool.query(
      query.text,
      query.values,
    );
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM `users` WHERE `email` = ?',
      values: [email],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (result.length > 0) {
      throw new InvariantError('User gagal ditambahkan: verifyNewEmail');
    }
  }

  async verifyUserCredential({ email, password }) {
    const query = {
      text: 'SELECT id, password, isAdmin FROM `users` WHERE email = ?',
      values: [email],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah atau sudah di deleted');
    }

    const { id, password: hashedPassword, isAdmin } = result[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang anda berikan salah tidak match');
    }

    return { id, isAdmin };
  }

  async verifyIsOwnCatalogues({ usersId, cataloguesId }) {
    const query = {
      text: 'SELECT id FROM `catalogues` WHERE `id_users` = ? AND `id` = ?',
      values: [usersId, cataloguesId],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new InvariantError('Anda tidak mempunyai akses!');
    }
  }

  async verifyIsAdmin({ usersId }) {
    const query = {
      text: 'SELECT id FROM `users` WHERE `id` = ? AND isAdmin = 1',
      values: [usersId],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new InvariantError('Anda tidak mempunyai akses!');
    }
  }
}

module.exports = UsersService;
