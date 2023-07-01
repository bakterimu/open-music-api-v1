/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/response');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._service.addAlbum(request.payload);
    const response = {
      data: {
        albumId,
      },
      code: 201,
    };
    return successResponse(response, h);
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    const response = {
      data: {
        album,
      },
    };
    return successResponse(response, h);
  }

  async putAlbumByIdHandler(request, h) {
    const { id } = request.params;
    this._validator.validateAlbumPayload(request.payload);
    await this._service.editAlbumById(id, request.payload);

    const response = {
      message: 'Catatan berhasil diubah.',
    };
    return successResponse(response, h);
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    const response = {
      message: 'Catatan berhasil dihapus.',
    };
    return successResponse(response, h);
  }
}

module.exports = AlbumsHandler;
