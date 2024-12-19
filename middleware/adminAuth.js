// import jwt from 'jsonwebtoken'


// const adminAuth = async (req, res, next)=>{
//     try {
        
//         const { token } = req.headers;
//         if (!token) {
//             return res.json({success: false, message: "Authorization Denied"})
//         }
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//             return res.json({success: false, message:"Authorization Denied"})
//         }
//         next();

//     } catch (error) {
//         console.log(error)
//         return res.json({success:false, message:error.message})
//     }
// }

// export default adminAuth;


// import jwt from 'jsonwebtoken';

// const adminAuth = async (req, res, next) => {
//     // Log received headers for debugging
//     console.log('⭐ Auth Middleware Started');
//     console.log('📜 Received headers:', req.headers);

//     // Check for token in multiple possible locations
//     const token = 
//         req.headers['authorization']?.split(' ')[1] || 
//         req.headers['token'] || 
//         req.headers['x-access-token'];

//     console.log('📜 Received token:', token);

//     if (!token) {
//         console.log('❌ No token provided');
//         return res.status(401).json({
//             success: false, 
//             message: 'No token provided, authorization denied'
//         });
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Additional role check
//         if (decoded.role !== 'admin') {
//             return res.status(403).json({
//                 success: false, 
//                 message: 'Not authorized, admin access required'
//             });
//         }

//         // Attach user info to request
//         req.user = decoded;
//         next();

//     } catch (error) {
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({
//                 success: false, 
//                 message: 'Invalid token'
//             });
//         }
//         console.error('Auth middleware error:', error);
//         return res.status(500).json({
//             success: false, 
//             message: 'Server error during authentication'
//         });
//     }
// };

// export default adminAuth;

// import jwt from 'jsonwebtoken';

// const adminAuth = async (req, res, next) => {
//     console.log('⭐ Auth Middleware Started');
//     console.log('📜 Received headers:', req.headers);

//     const token = 
//         req.headers['authorization']?.split(' ')[1] || 
//         req.headers['token'] || 
//         req.headers['x-access-token'];

//     console.log('📜 Received token:', token);

//     if (!token) {
//         return res.status(401).json({
//             success: false, 
//             message: 'No token provided, authorization denied'
//         });
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Simplified role check
//         if (decoded.role !== 'admin') {
//             return res.status(403).json({
//                 success: false, 
//                 message: 'Not authorized, admin access required'
//             });
//         }

//         // No database user check
//         next();

//     } catch (error) {
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({
//                 success: false, 
//                 message: 'Invalid token'
//             });
//         }
//         console.error('Auth middleware error:', error);
//         return res.status(500).json({
//             success: false, 
//             message: 'Server error during authentication'
//         });
//     }
// };

// export default adminAuth;


import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
    try {
        console.log("⭐ Admin Auth Middleware Started");
    
        // Check for token in both cookies and headers
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log("❌ No token provided");
            return res.status(401).json({ 
                success: false, 
                message: "Access denied. No token provided." 
            });
        }
    
        // Decode and verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔓 Decoded token:", decoded);
    
        // Try finding user with either id or _id from token
        const userId = decoded.id || decoded._id;
        const user = await userModel.findById(userId);
        if (!user) {
            console.log("❌ User not found in database");
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
    
        // Check if user is admin (more flexible check)
        const isAdmin = user.role === 'admin' || 
                       user.email === process.env.ADMIN_EMAIL ||
                       user.isAdmin === true;
        
        if (!isAdmin) {
            console.log("❌ Not admin. User details:", {
                role: user.role,
                email: user.email,
                isAdmin: user.isAdmin
            });
            return res.status(403).json({ 
                success: false, 
                message: "Admin access required" 
            });
        }

        // Convert to plain object and add both id and _id references
        const userObject = user.toObject();
        userObject.id = userObject._id; // Ensure both are available
        req.user = userObject;
        
        console.log("✅ Admin verified and added to request:", req.user);
    
        next();
    } catch (error) {
        console.log("❌ Admin Auth error:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: "Invalid token", 
            error: error.message 
        });
    }
};

export default adminAuth;