const Joi = require('joi');

const SongsPayloadsSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const SongsGetPayloadsSchema = Joi.object({
  title: Joi.string(),
  performer: Joi.string(),
});

module.exports = { SongsPayloadsSchema, SongsGetPayloadsSchema };
