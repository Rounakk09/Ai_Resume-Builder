import { Router } from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

// All resume routes are protected by JWT authentication
router.use(authenticateJWT);

router.route('/')
  .get(getResumes)
  .post(createResume);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

export default router;
