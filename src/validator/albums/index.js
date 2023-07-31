const InvariantError = require('../../exceptions/invariantError');
const { AlbumPayloadsSchema } = require('./schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validateResult = AlbumPayloadsSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
