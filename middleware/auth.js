import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
    try {
        console.log("⭐ Auth Middleware Started");
    
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log("❌ No token provided");
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔓 Decoded token:", decoded);
    
        // Try finding user with either id or _id from token
        const userId = decoded.id || decoded._id;
        const user = await userModel.findById(userId);
        if (!user) {
            console.log("❌ User not found in database");
            return res.status(404).json({ success: false, message: "User not found" });
        }
    
        // Convert to plain object and add both id and _id references
        const userObject = user.toObject();
        userObject.id = userObject._id; // Ensure both are available
        req.user = userObject;
        
        console.log("👤 User added to request:", req.user);
    
        next();
    } catch (error) {
        console.log("❌ Auth error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid token", error: error.message });
    }
};

export default authUser;