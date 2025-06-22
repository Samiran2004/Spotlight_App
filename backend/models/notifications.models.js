import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    typeOfNotification: {
        type: String,
        enum: ["like", "comment", "follow"],
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: false
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            required: false
        }
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;