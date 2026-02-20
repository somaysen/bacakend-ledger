import Joi from 'joi';
import { AppError } from '../utils/errorHander.js';

/**
 * Validates request segments (body, params, query) using Joi schemas.
 * Provide an object like { body: Joi.object({...}), params: Joi.object({...}) }.
 */
export const validate = (schema) => (req, res, next) => {
  if (!schema || typeof schema !== 'object') {
    throw new Error('Invalid schema');
  }

  const segments = ['body', 'params', 'query'];
  const errors = [];
  const validated = {};

  segments.forEach((segment) => {
    if (!schema[segment]) return;
    if (!Joi.isSchema(schema[segment])) {
      throw new AppError(`Invalid Joi schema for ${segment}`);
    }

    const { error, value } = schema[segment].validate(req[segment], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      errors.push({
        segment,
        details: error.details.map(({ message, path }) => ({ message, path }))
      });
    } else {
      validated[segment] = value;
    }
  });

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  Object.assign(req, validated);
  next();
};
