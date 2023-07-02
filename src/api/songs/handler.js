/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/response');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);
    const response = {
      data: {
        songId,
      },
      code: 201,
    };
    return successResponse(response, h);
  }

  async getSongsHandler(request, h) {
    this._validator.validateGetSongPayload(request.query);
    const songs = await this._service.getSongs(request.query);
    const response = {
      data: {
        songs,
      },
    };
    return successResponse(response, h);
  }

  async getSongByIdHandler(request, h) {
    const song = await this._service.getSongById(request.params);
    const response = {
      data: {
        song,
      },
    };
    return successResponse(response, h);
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    await this._service.editSongById(request.params, request.payload);
    const response = {
      message: 'Lagu berhasil diperbarui.',
    };
    return successResponse(response, h);
  }

  async deleteSongByIdHandler(request, h) {
    await this._service.deleteSongById(request.params);
    const response = {
      message: 'Lagu berhasil dihapus.',
    };
    return successResponse(response, h);
  }
}

module.exports = SongsHandler;
