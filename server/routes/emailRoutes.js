import express from 'express';
import { getEmails, sendEmail, toggleStar } from '../controllers/emailController.js';

const router = express.Router();

router.get('/', getEmails);
router.post('/send', sendEmail);
router.patch('/:emailId/star', toggleStar);

export default router;