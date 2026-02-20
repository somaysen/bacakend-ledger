import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const jobSchema = {
  body: Joi.object({
    title: Joi.string().trim().min(1).required(),
    description: Joi.string().min(1).required(),
    company: Joi.string().trim().min(1).required(),
    salary: Joi.number().positive().optional()
  })
};

export const updateJobSchema = {
  params: Joi.object({
    id: objectId.required()
  }),
  body: Joi.object({
    title: Joi.string().trim(),
    description: Joi.string(),
    company: Joi.string().trim(),
    salary: Joi.number().positive()
  }).min(1)
};
