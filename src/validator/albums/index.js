const InvariantError = require('../../exceptions/invariantError');
const { AlbumPayloadsSchema } = require('./schema');

const AlbumValidator = {
  validateAlbum: (payload) => {
    const validateResult = AlbumPayloadsSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error);
    }
  },
};

module.exports = AlbumValidator;
