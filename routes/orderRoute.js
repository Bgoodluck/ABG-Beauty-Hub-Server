import express from 'express'
import {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    placeOrderFlutterwave,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
    verifyFlutterwave  
} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'





const orderRouter = express.Router()

// Admin Features
orderRouter.get('/list',authUser, allOrders)
orderRouter.post('/status', authUser, updateStatus)


// Paymnent Features
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)
orderRouter.post('/flw',authUser, placeOrderFlutterwave)

// User Features
orderRouter.post('/userorders', authUser,userOrders)

// Verify Payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyFlw', authUser, verifyFlutterwave)

export default orderRouter;