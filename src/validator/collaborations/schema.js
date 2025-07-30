const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  albumId: Joi.string().required(),
  songId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };