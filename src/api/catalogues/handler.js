class CataloguesHandler {
  constructor(cataloguesService, usersService) {
    this._cataloguesService = cataloguesService;
    this._usersService = usersService;

    this.postCataloguesHandler = this.postCataloguesHandler.bind(this);
    this.putCataloguesHandler = this.putCataloguesHandler.bind(this);
    this.deleteCataloguesHandler = this.deleteCataloguesHandler.bind(this);
    this.putCataloguesStatusHandler = this.putCataloguesStatusHandler.bind(this);
    this.getCataloguesHandler = this.getCataloguesHandler.bind(this);
    this.getCataloguesBySlugHandler = this.getCataloguesBySlugHandler.bind(this);
    this.getCataloguesByIdHandler = this.getCataloguesByIdHandler.bind(this);
  }

  async postCataloguesHandler(request, h) {
    const { id: usersId } = request.auth.credentials;
    const {
      package_name, description, price, isPublished, image
    } = request.payload;

    const cataloguesId = await this._cataloguesService.addCatalogues({
      usersId, package_name, description, price, isPublished, image
    });

    const response = h.response({
      status: 'success',
      message: 'Katalog berhasil ditambahkan!',
      data: {
        cataloguesId
      }
    });
    response.code(201);
    return response;
  }

  async putCataloguesHandler(request, h) {
    const { id: cataloguesId } = request.params;
    const { id: usersId } = request.auth.credentials;
    const { package_name, description, price, image } = request.payload;

    await this._usersService.verifyIsOwnCatalogues({ usersId, cataloguesId });
    await this._cataloguesService.putCatalogues({ cataloguesId, package_name, description, price, image });

    const response = h.response({
      status: 'success',
      message: 'Katalog berhasil diubah!',
    });
    response.code(201);
    return response;
  }

  async deleteCataloguesHandler(request, h) {
    const { id: cataloguesId } = request.params;
    const { id: usersId } = request.auth.credentials;

    await this._usersService.verifyIsOwnCatalogues({ usersId, cataloguesId });
    await this._cataloguesService.deleteCatalogues({ cataloguesId });

    return {
      status: 'success',
      message: 'Katalog berhasil dihapus!',
    };
  }

  async putCataloguesStatusHandler(request, h) {
    const { id: usersId } = request.auth.credentials;
    const { id: cataloguesId } = request.params;

    await this._usersService.verifyIsOwnCatalogues({ usersId, cataloguesId });
    const { isPublished } = await this._cataloguesService.checkIsPublishedCatalogues({
      cataloguesId
    });
    const updateIsPublished = isPublished === 0 ? 1 : 0;
    await this._cataloguesService.updateCataloguesStatus({
      updateIsPublished,
      cataloguesId
    });

    return {
      status: 'success',
      message: 'Status katalog berhasil diubah!',
    }
  }

  async getCataloguesBySlugHandler(request, h) {
    const { slug } = request.params;

    const catalogues = await this._cataloguesService.getCataloguesBySlug({ slug });

    const data = {
      ...catalogues,
      image_url: `http://${request.headers.host}/${catalogues.image_url}`
    }

    return {
      status: 'success',
      data,
    };
  }

  async getCataloguesHandler(request, h) {
    const { isAuthenticated } = request.auth;

    let catalogues;
    if (isAuthenticated) {
      const { id: usersId, isAdmin = null } = request?.auth?.credentials;
      if (isAdmin) {
        catalogues = await this._cataloguesService.getCataloguesAdmin({ usersId });
      }
    } else {
      catalogues = await this._cataloguesService.getCatalogues();
    }

    const data = catalogues.map((catalogue) => ({
      ...catalogue,
      image_url: `http://${request.headers.host}/${catalogue.image_url}`
    }));

    return {
      status: 'success',
      data,
    };
  }

  async getCataloguesByIdHandler(request, h) {
    const { id: cataloguesId } = request.params;

    const catalogues = await this._cataloguesService.getCataloguesById({ cataloguesId });

    const data = {
      ...catalogues,
      image: `http://${request.headers.host}/${catalogues.image}`
    }

    return {
      status: 'success',
      data,
    };
  }
}

module.exports = CataloguesHandler;