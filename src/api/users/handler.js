const { successResponse } = require('../../utils/response');

/* eslint-disable no-underscore-dangle */
class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler(req, h) {
    this._validator.validateUserPayload(req.payload);
    const userId = await this._service.addUser(req.payload);
    const response = {
      data: {
        userId,
      },
      code: 201,
    };
    return successResponse(response, h);
  }
}

module.exports = UsersHandler;
