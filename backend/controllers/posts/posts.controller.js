import express from 'express';
import userAuth from "../../middlewares/userAuthMiddleware.js";
import cloudinary from '../../cloudinary.js';
import Post from '../../models/posts.models.js';
import User from '../../models/users.models.js';
import Like from '../../models/likes.models.js';
import Bookmark from '../../models/bookmarks.models.js';

const router = express.Router();

router.post('/create', userAuth, async (req, res) => {
    try {
        const { image, caption } = req.body;
        if (!image) {
            return res.status(400).json({
                status: 'Failed',
                message: "All fields are required"
            });
        }

        console.log(image);
        console.log(caption);

        const imageUploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = imageUploadResponse.secure_url;

        const storageId = imageUrl.split('/').pop().split(".")[0];

        const newPost = new Post({
            userId: req.user._id,
            storageId: storageId,
            imageUrl: imageUrl,
            caption: caption,
            likes: 0,
            comments: 0
        });

        await newPost.save();

        await User.findByIdAndUpdate(req.user._id, { $inc: { posts: 1 } });

        return res.status(201).json({
            status: 'Ok',
            message: "Post created",
            data: newPost
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error"
        });
    }
});

router.get('/get-all', userAuth, async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', '-password').sort({ createdAt: -1 });

        const postData = await Promise.all(
            posts.map(async (post) => {
                const likes = await Like.find({ postId: post._id });

                const isLiked = likes.some(like => like.userId.toString() === req.user._id.toString());

                const bookmarks = await Bookmark.find({postId: post._id});

                const isBookMarked = bookmarks.some(bookmark => bookmark.userId.toString() === req.user._id.toString());

                return {
                    ...post.toObject(),
                    isLiked,
                    isBookMarked
                };
            })
        );


        return res.status(200).json({
            status: 'Ok',
            data: postData
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error"
        });
    }
});

export default router;