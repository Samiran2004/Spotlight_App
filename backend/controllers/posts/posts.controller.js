import express from 'express';
import userAuth from "../../middlewares/userAuthMiddleware.js";
import cloudinary from '../../cloudinary.js';
import Post from '../../models/posts.models.js';
import User from '../../models/users.models.js';
import Like from '../../models/likes.models.js';
import Bookmark from '../../models/bookmarks.models.js';
import Notification from '../../models/notifications.models.js';
import Comment from '../../models/comments.models.js';

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

                const bookmarks = await Bookmark.find({ postId: post._id });

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

router.post('/like', userAuth, async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({
                status: 'Failed',
                message: "Please provide postId!"
            });
        }

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                status: 'Failed',
                message: "Post not found!"
            });
        }

        // Check if already liked
        const existingLike = await Like.findOne({ postId, userId: req.user._id });

        if (existingLike) {
            await Like.findOneAndDelete({ postId, userId: req.user._id });
            await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });

            return res.status(200).json({
                status: 'Ok',
                message: "Unliked the post",
                isLiked: false,
                likes: post.likes
            });
        }

        // Add new like
        const newLike = new Like({ postId, userId: req.user._id });
        await newLike.save();
        await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

        // Add notification if not liking own post
        if (post.userId.toString() !== req.user._id.toString()) {
            const newNotification = new Notification({
                receiverId: post.userId,
                senderId: req.user._id,
                typeOfNotification: "like"
            });
            await newNotification.save();
            // console.log(newNotification)
        }

        return res.status(200).json({
            status: 'Ok',
            message: "Liked the post",
            isLiked: true,
            likes: post.likes
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error"
        });
    }
});

router.get('/comment', async (req, res) => {
    console.log("Hit get comments route.");
    try {
        const { postId } = req.query;
        if (!postId) {
            return res.status(400).json({
                status: 'Failed',
                message: "All fields are required."
            });
        }

        const isPostExist = await Post.findById(postId);
        if (!isPostExist) {
            return res.status(400).json({
                status: 400,
                message: "No post found."
            });
        }
        const comments = await Comment.find({ postId: postId }).populate({
            path: "userId",
            select: "-password"
        });
        // console.log({ comments });
        return res.status(200).json({
            status: 'Ok',
            data: comments
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error."
        });
    }
});

router.post('/comment', userAuth, async (req, res) => {
    console.log("Hit post comment route.");
    try {
        const { postId, content } = req.body;

        if (!postId || !content) {
            return res.status(400).json({
                status: 'Failed',
                message: "Please provide all required fields."
            });
        }

        // Increment comment count and get post in one call
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { comments: 1 } },
            { new: true, lean: true }
        );

        if (!post) {
            return res.status(404).json({
                status: 'Failed',
                message: "Post not found."
            });
        }

        // Save new comment
        const newComment = new Comment({
            userId: req.user._id,
            postId,
            content
        });
        await newComment.save();

        // Notify if commenter is not the post author
        if (post.userId.toString() !== req.user._id.toString()) {
            const newNotification = new Notification({
                receiverId: post.userId,
                senderId: req.user._id,
                typeOfNotification: "comment"
            });
            await newNotification.save();
        }

        return res.status(201).json({
            status: 'Ok',
            message: 'Comment added successfully',
            comment: newComment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error"
        });
    }
});

router.post('/toggle-bookmark', userAuth, async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({
                status: 'Failed',
                message: "PostId is required."
            });
        }

        // Check if post exists
        const isPost = await Post.findById(postId);
        if (!isPost) {
            return res.status(400).json({
                status: 'Failed',
                message: "Post not found, please provide a valid postId."
            });
        }

        // Check if bookmark already exists
        const existingBookmark = await Bookmark.findOne({
            postId: postId,
            userId: req.user._id
        });

        if (existingBookmark) {
            // Bookmark exists -> remove it
            await Bookmark.findByIdAndDelete(existingBookmark._id);
            return res.status(200).json({
                status: 'Ok',
                message: 'Bookmark removed.',
                isBookmarked: false
            });
        } else {
            // Bookmark does not exist -> create it
            const newBookmark = new Bookmark({
                postId: postId,
                userId: req.user._id
            });
            await newBookmark.save();
            return res.status(200).json({
                status: 'Ok',
                message: 'Bookmark added.',
                isBookmarked: true
            });
        }

    } catch (error) {
        console.error('Error toggling bookmark:', error);
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error"
        });
    }
});

router.get('/get-bookmarks', userAuth, async (req, res) => {
    try {
        const bookMarks = await Bookmark.find({ userId: req.user._id }).populate({ path: "postId" });
        if (!bookMarks) {
            return res.status(400).json({
                status: 'Failed',
                message: "No Bookmarks Found"
            })
        }
        return res.status(200).json({
            status: 'Ok',
            data: bookMarks
        })
    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error."
        })
    }
});

export default router;