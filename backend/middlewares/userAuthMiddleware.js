import jwt from 'jsonwebtoken';
import User from '../models/users.models.js';
import dotenv from 'dotenv';
dotenv.config();

const userAuth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader && !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                status: 'Failed',
                message: "No authentication token, access denied."
            })
        }

        const token = authHeader.replace("Bearer ", "");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).json({
                status: 'Failed',
                message: "Token is not valid."
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            message: "Internal Server Error"
        })
    }
}

export default userAuth;