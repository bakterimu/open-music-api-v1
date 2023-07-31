const InvariantError = require('../../exceptions/invariantError');
const UsersPayloadSchema = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => {
    const validateResult = UsersPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = UserValidator;
