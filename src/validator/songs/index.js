const InvariantError = require('../../exceptions/invariantError');
const { SongsPayloadsSchema, SongsGetPayloadsSchema } = require('./schema');

const SongValidator = {
  validateSongPayload: (payload) => {
    const validateResult = SongsPayloadsSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
  validateGetSongPayload: (payload) => {
    const validateResult = SongsGetPayloadsSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = SongValidator;
