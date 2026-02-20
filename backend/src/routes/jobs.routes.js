import { Router } from 'express';
import { authGuard } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createJob, deleteJob, getJob, getJobStats, listJobs, updateJob } from '../controllers/jobs.controller.js';
import { jobSchema, updateJobSchema } from '../validators/job.validator.js';

const router = Router();



router.use(authGuard());
router.get('/', listJobs);
router.get('/stats', authGuard(['admin']), getJobStats);
router.post('/', validate(jobSchema), createJob);
router.get('/:id', getJob);
router.put('/:id', authGuard(['admin']), validate(updateJobSchema), updateJob);
router.delete('/:id', deleteJob);

export default router;
