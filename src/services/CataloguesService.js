const pool = require('./SqlService');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const Base64ToImg = require('../utils/base64Image');

class CataloguesService {
  constructor() {
    this._pool = pool.promise();
  }

  async convertToSlug(name) {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  async addCatalogues({ usersId, package_name, description, price, isPublished, image }) {
    const filename = await Base64ToImg(image);
    const imageUrl = `images/${filename}`;
    const slug = await this.convertToSlug(package_name);

    const query = {
      text: 'INSERT INTO catalogues (id_users, image_url, package_name, slug, description, price, isPublished, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP() ,CURRENT_TIMESTAMP())',
      values: [usersId, imageUrl, package_name, slug, description, price, isPublished]
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.insertId) {
      throw new InvariantError('Katalog gagal ditambahkan: addCatalogues');
    }

    return result.insertId;
  }

  async putCatalogues({ cataloguesId, package_name, description, price, image }) {
    const filename = await Base64ToImg(image);
    const imageUrl = `images/${filename}`;
    const slug = await this.convertToSlug(package_name);

    const query = {
      text: 'UPDATE catalogues SET image_url = ?, package_name = ?, slug = ?, description = ?, price = ?, updated_at = CURRENT_TIMESTAMP() WHERE id = ?',
      values: [imageUrl, package_name, slug, description, price, cataloguesId]
    };

    await this._pool.query(
      query.text,
      query.values,
    );
  }

  async getCataloguesBySlug({ slug }) {
    const query = {
      text: `SELECT 
      id, package_name, description, price, image_url FROM catalogues 
      WHERE slug = ? AND isPublished = 1`,
      values: [slug],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new NotFoundError('Katalog tidak tersedia');
    }

    return result[0];
  }

  async getCatalogues() {
    const query = {
      text: `SELECT id, package_name, slug, description, price, image_url, isPublished FROM catalogues WHERE isPublished = 1`,
    }

    const [result, fields] = await this._pool.query(
      query.text,
    );

    return result;
  }

  async getCataloguesAdmin({ usersId }) {
    const query = {
      text: `SELECT 
      id, package_name, slug, description, price, image_url, isPublished 
      FROM catalogues 
      WHERE id_users = ?`,
      values: [usersId]
    }

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    return result;
  }

  async deleteCatalogues({ cataloguesId }) {
    const query = {
      text: `DELETE FROM catalogues WHERE id = ?`,
      values: [cataloguesId],
    }

    await this._pool.query(
      query.text,
      query.values,
    );
  }

  // END

  // UpdateStatus
  async checkIsPublishedCatalogues({ cataloguesId }) {
    const query = {
      text: 'SELECT isPublished FROM `catalogues` WHERE `id` = ?',
      values: [cataloguesId],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new NotFoundError('Katalog tidak tersedia');
    }

    return result[0];
  }

  async updateCataloguesStatus({ updateIsPublished, cataloguesId }) {
    const query = {
      text: 'UPDATE `catalogues` SET isPublished = ? WHERE id = ?',
      values: [updateIsPublished, cataloguesId],
    };

    await this._pool.query(
      query.text,
      query.values,
    );
  }

  async getCataloguesById({ cataloguesId }) {
    const query = {
      text: 'SELECT package_name, description, price, image_url AS image FROM `catalogues` WHERE `id` = ?',
      values: [cataloguesId],
    };

    const [result, fields] = await this._pool.query(
      query.text,
      query.values,
    );

    if (!result.length > 0) {
      throw new NotFoundError('Katalog tidak tersedia');
    }

    return result[0];
  }
}

module.exports = CataloguesService;
