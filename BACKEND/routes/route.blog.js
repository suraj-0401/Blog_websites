import express from 'express';
import {createBlog,deleteBlog, getAllBlogs, getSingleBlog, getMyBlog,updateBlog, getRelatedBlog  } from '../controllers/Controllers.Blog.js'; // Use import for ESM, add .js extension
import {isAuthenticated,authorizeRoles} from '../middleware/authUser.js'

const router = express.Router();

// Define the router
router.post('/createBlog',isAuthenticated,createBlog);
router.delete("/deleteBlog/:id",deleteBlog)
router.put('/updateBlog/:id',updateBlog);
router.get('/getAllBlog',getAllBlogs)
router.get('/getSingleBlog/:id',getSingleBlog)
router.get('/getMyBlog/',isAuthenticated,getMyBlog)
router.get('/getRelatedBlog',getRelatedBlog);

// Export the router
export default router;

