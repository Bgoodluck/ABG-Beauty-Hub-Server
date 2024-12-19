// import userModel from "../models/userModel.js";

// // {----adding products to user cart--------}

// const addToCart = async (req, res) => {
//     try {

//         const { userId, itemId, size } = req.body;

//         const userData = await userModel.findById(userId);
//         let cartData = await userData.cartData;

//         if (cartData[itemId]) {
//             if (cartData[itemId][size]) {
//                 cartData[itemId][size] += 1
//             } else {
//                 cartData[itemId][size] = 1
//             }
//         } else {
//             cartData[itemId] = {}
//             cartData[itemId][size] = 1
//         }

//         await userModel.findByIdAndUpdate(userId, { cartData })

//         return res.json({ success: true, message: 'Added To Cart' })

//     } catch (error) {
//         console.log(error)
//         return res.json({ success: false, message: error.message })
//     }

// }


// // {------updating user cart-------}

// const updateCart = async (req, res) => {

//     try {

//         const { userId, itemId, size, quantity } = req.body;

//         const userData = await userModel.findById(userId);
//         let cartData = await userData.cartData;

//         cartData[itemId][size] = quantity

//         await userModel.findByIdAndUpdate(userId, { cartData })

//         return res.json({ success: true, message: 'Cart Updated' })

//     } catch (error) {
//         console.log(error)
//         return res.json({ success: false, message: error.message })
//     }

// }



// // {-----get user cart data--------}

// const getUserCart = async (req, res)=> {

//     try {
        
//         const { userId } = req.body;

//         const userData = await userModel.findById(userId);
//         let cartData = await userData.cartData;

//         return res.json({success: true, cartData})

//     } catch (error) {
//         console.log(error)
//         return res.json({ success: false, message: error.message }) 
//     }
    
// }



// export { addToCart, updateCart, getUserCart }


import userModel from "../models/userModel.js";

// {----adding products to user cart--------}
const addToCart = async (req, res) => {
    try {
        // Use req.user.id from the auth middleware instead of req.body.userId
        const userId = req.user.id;
        const { itemId, size } = req.body;

        const userData = await userModel.findById(userId);
        
        // Add a null check
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Ensure cartData exists, initialize if it doesn't
        if (!userData.cartData) {
            userData.cartData = {};
        }

        let cartData = userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, { cartData })

        return res.json({ success: true, message: 'Added To Cart' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// {------updating user cart-------}
const updateCart = async (req, res) => {
    try {
        // Use req.user.id from the auth middleware
        const userId = req.user.id;
        const { itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        
        // Add a null check
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Ensure cartData exists, initialize if it doesn't
        if (!userData.cartData) {
            userData.cartData = {};
        }

        let cartData = userData.cartData;

        // Ensure the specific item and size exist before updating
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData })

        return res.json({ success: true, message: 'Cart Updated' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// {-----get user cart data--------}
const getUserCart = async (req, res)=> {
    try {
        // Use req.user.id from the auth middleware
        const userId = req.user.id;

        const userData = await userModel.findById(userId);
        
        // Add a null check
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Ensure cartData exists, initialize if it doesn't
        const cartData = userData.cartData || {};

        return res.json({success: true, cartData})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message }) 
    }
}

export { addToCart, updateCart, getUserCart }