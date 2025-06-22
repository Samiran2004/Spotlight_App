import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Follow = mongoose.model("Follow", followSchema);

export default Follow;