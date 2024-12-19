import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";



// // {---token creation-----}
// const createToken = (id)=>{
//     return jwt.sign({id}, process.env.JWT_SECRET)
// }


// // {------Route for user login-------}

const validatePassword = (password) => {
  const pass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return pass.test(password);
};

const registerUser = async (req, res) => {
  try {
    const { 
      name,
      email, 
      password,      
    } = req.body;

    // Validate inputs
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Invalid password. It must be at least 8 characters long and contain at least one letter and one number.",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide Name",
      });
    }

    // Check if user already exists
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle picture upload
    let picturePath = '';
    if (req.file) {
      // Remove 'public' from path for client-side access
      picturePath = req.file.path.replace(/^public/, '').replace(/\\/g, '/');
    }

    // Create new user payload
    const payload = {
      name,
      email,
      password: hashedPassword,
      picture: picturePath,
      role: "user",
      
    };

    // Save user to database
    const userData = new userModel(payload);
    await userData.save();

    // Generate token
    const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Respond with user data
    res.status(201).json({
      success: true,
      message: "Registration Successful",
      userData: {
        _id: userData._id,
        token,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        picturePath: userData.picture,
        
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
  



 const loginUser = async (req, res)=>{

  try {

    const { email, password } = req.body;

    if (!email ||!password) {
      return res.status(400).json({ 
          success: false, 
          message: "Please provide email and password"
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ 
          success: false, 
          message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ 
          success: false, 
          message: "Invalid password"
      });
    }

    if (isMatch) {
      const payload = {
        id: user._id,
        email: user.email,

        // role: user.role
      }
      const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
      
      const tokenOption = {
        secure: true,
        httpOnly: true
      }

      res.cookie("token", token, tokenOption ).json({
        success: true,
        message: "Login Successful",
        userData: {
            _id: user._id,
            token,
            name: user.name,
            email: user.email              
        }
      });
      console.log("Token Details:",token)
      
    }   
    
  } catch (error) {
    console.error(error);
      res.status(500).json({
          message: error.message || "Internal Server Error",
          success: false
      })
  }
}



const getUser = async(req, res)=>{
  try {
      // Change from req.params._id to req.params.id
      const user = await userModel.findById(req.params.id);

      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found"
          });
      }

      res.json({
          success: true,
          message: "User retrieved successfully",
          userData: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              picturePath: user.picture                               
          }
      });
      
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: error.message || "Internal Server Error",
          success: false
      });
  }
}



const userDetails = async (req, res) => {
  try {
      console.log("⭐ UserDetails Controller Started");
      console.log("👤 Incoming req.user:", JSON.stringify(req.user, null, 2));

      if (!req.user) {
          console.log("❌ No user object in request");
          return res.status(401).json({
              success: false,
              message: "User not authenticated"
          });
      }

      if (!req.user._id) {
          console.log("❌ No user ID found in user object");
          return res.status(400).json({
              success: false,
              message: "Invalid user data"
          });
      }

      // Generate new token
      const token = jwt.sign(
          { 
              id: req.user._id,
              email: req.user.email 
          }, 
          process.env.JWT_SECRET, 
          { expiresIn: '30d' }
      );

      console.log("✅ New token generated");

      // Construct user response object based on your schema
      const userResponse = {
          success: true,
          message: "User details retrieved successfully",
          data: {
              _id: req.user._id,
              name: req.user.name,
              email: req.user.email,
              profilePic: req.user.profilePic || null,
              role: req.user.role || "user",
              cartData: req.user.cartData || {},
              token: token
          }
      };

      console.log("📦 User response prepared:", {
          ...userResponse,
          data: {
              ...userResponse.data,
              token: "TOKEN_EXISTS"  // Hide actual token in logs
          }
      });

      return res.status(200).json(userResponse);

  } catch (error) {
      console.log("❌ UserDetails error:", {
          message: error.message,
          stack: error.stack
      });
      
      return res.status(500).json({
          success: false,
          message: "Error fetching user details",
          error: error.message
      });
  }
};
  
  const logout = async(req, res)=>{
    try {
      res.clearCookie("token");
      return res.json({
          success: true,
          message: "Logged out successfully",
          data: []
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "Error logging out",
          error: error.message
      });
    }
  }
  
  
  
  
  
  // {for admin order inventory}
 
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Directly compare with environment variables
  if (
    email === process.env.ADMIN_EMAIL && 
    password === process.env.ADMIN_PASSWORD
  ) {
    // Create token with admin role
    const token = jwt.sign(
      { 
        role: 'admin', 
        email: email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    return res.json({
      success: true,
      message: 'Admin login successful',
      token,
      role: 'admin'
    });
  }

  // If credentials don't match
  return res.status(401).json({
    success: false,
    message: 'Invalid admin credentials'
  });
};



    const getUserDetails = async (req, res) => {
        try {
          // console.log("Requested user ID:", req.params.userId);
          const user = await userModel.findById(req.params.userId).select('name');
          
          if (!user) {
            return res.status(404).json({
              success: false,
              message: 'User not found'
            });
          }
      
          console.log("User found:", user);
          return res.json({
            success: true,
            name: user.name,
            userId: user._id
          });
        } catch (error) {
          console.error("Error in getUserDetails:", error);
          return res.status(500).json({
            success: false,
            message: error.message
          });
        }
      }


const allUsers = async (req, res) => {

  try {
    const users = await userModel.find();
    // console.log("allUsers", users)
    return res.json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
}


const updateUser = async (req, res) => {
  try {
      // Use req.user.id instead of separate userId and sessionUser
      const userId = req.user.id;

      const { email, name, role } = req.body;

      if (!userId) {
          return res.status(400).json({
              success: false,
              message: "Please provide userId"
          });
      }

      const currentUser = await userModel.findById(userId);

      const payload = {
          ...(email && { email: email }),
          ...(name && { name: name }),
          ...(role && { role: role })
      }

      const updatedUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });

      res.json({
          success: true,
          message: "User updated successfully",
          data: updatedUser
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "Error updating user",
          error: error.message
      });
  }
}
      






export { loginUser, registerUser, adminLogin, userDetails, getUserDetails,updateUser, allUsers, logout, getUser }