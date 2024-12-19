import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import subscribeRoute from './routes/subscribeRoute.js'
import staffRoute from './routes/staffRoute.js'
import staffReviewRoute from './routes/staffReviewRoute.js'
import productReviewRoute from './routes/productReviewRoute.js'
import appointmentRoute from './routes/appointmentRoute.js'
import profileRouter from './routes/profileRoute.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path'







const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// App config
const app = express()
const port = process.env.PORT || 4000
connectDB();
connectCloudinary()


// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true})) // for handling form data
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
    allowedHeaders: ["Content-Type", "Authorization", "auth-token", "token"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));


// api endpoints
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use("/api/newsletter", subscribeRoute)
app.use("/api/staff", staffRoute)
app.use("/api/product/review", productReviewRoute)
app.use("/api/staff/review", staffReviewRoute)
app.use("/api/appointments", appointmentRoute)


const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}


app.get('/',(req, res)=>{
    res.send('API is running')
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))