// import express from 'express'
// import upload from '../middleware/multers.js';
// import adminAuth from '../middleware/adminAuth.js'
// import authUser from '../middleware/auth.js';
// import authToken from '../middleware/authToken.js';
// import { 
//      loginUser, 
//      registerUser, 
//      adminLogin, 
//      userDetails, 
//      getUserDetails,
//      updateUser, 
//      allUsers, 
//      logout, 
//      getUser 
//     } from '../controllers/userController.js'

// const userRouter = express.Router();

// userRouter.post('/register',upload.single('picture'), registerUser);
// userRouter.post('/login', loginUser);
// userRouter.post('/admin', adminLogin);
// userRouter.get("/user-details",authUser, userDetails)
// userRouter.get("/logout",logout)
// userRouter.get("/:id",authUser,getUser)



// // Admin Panel Only

// userRouter.get("/all-users",adminAuth,allUsers)
// userRouter.post("/update-user",adminAuth,updateUser)
// userRouter.get('/:userId', adminAuth,getUserDetails);



// export default userRouter;



import express from 'express'
import upload from '../middleware/multers.js';
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js';
import { 
     loginUser, 
     registerUser, 
     adminLogin, 
     userDetails, 
     getUserDetails,
     updateUser, 
     allUsers, 
     logout, 
     getUser 
    } from '../controllers/userController.js'

const userRouter = express.Router();

// Public routes
userRouter.post('/register', upload.single('picture'), registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin-login', adminLogin);
userRouter.get('/logout', logout);

// User-specific routes (require authentication)
userRouter.get("/user-details", authUser, userDetails);
userRouter.get("/user/:id", authUser, getUser);
userRouter.post("/update-user", authUser, updateUser);

// Admin routes
userRouter.get("/admin/users", authUser, allUsers);
userRouter.get("/admin/user-details/:userId", adminAuth, getUserDetails);

export default userRouter;