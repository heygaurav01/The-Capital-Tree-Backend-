const express = require('express');
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

//  Public Routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

//  Admin-Only Routes
router.post('/', authMiddleware, roleMiddleware(['admin']), createBlog);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateBlog);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteBlog);

module.exports = router;
