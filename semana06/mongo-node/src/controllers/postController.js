import postService from "../services/postService.js";
import postRepository from "../repositories/postRepository.js";
import Post from "../models/Post.js";

class PostController {
    async create(req, res) {
        try {
            const { userId, title, content, hashtags, imageUrl } = req.body;
            const hashtagArray = hashtags ? hashtags.split(',').map(h => h.trim()) : [];

            await postService.createPost(userId, {
                title, content, imageUrl, hashtags: hashtagArray
            });
            res.redirect("/posts");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async delete(req, res) {
        try {
            await Post.findByIdAndDelete(req.params.id);
            res.redirect("/posts");
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getEditForm(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            res.render("editPost", { post });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async update(req, res) {
        try {
            const { title, content, imageUrl, hashtags } = req.body;
            const hashtagArray = hashtags ? hashtags.split(',').map(h => h.trim()) : [];

            await postRepository.update(req.params.id, {
                title, content, imageUrl, hashtags: hashtagArray
            });
            res.redirect("/posts");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            console.log(posts);
            res.render("posts", { posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PostController();
