import express from 'express'
import PostSummary from '../controllers/Controllers.postSummary.js';
const router=express.Router();
router.post('/postsummary',PostSummary);
export default router;