const Blog = require('../models/Blog');

//  Create Blog Post
exports.createBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const blog = await Blog.create({ title, content, author });
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Blogs
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Get Blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Update Blog (Admin Only)
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        blog.title = title;
        blog.content = content;
        blog.author = author;
        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Delete Blog (Admin Only)
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        await blog.destroy();
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
