import express from "express"
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import { 
    GetStaffs,
    UploadStaffs,
    UpdateStaffs,
    ListStaffCategory,
    GetAllStaffCategories,
    GetStaffDetails    
 } from "../controllers/staffController.js";



const router = express.Router()


router.post("/upload-staff", UploadStaffs)
router.get("/get-staffs", GetStaffs)
router.post("/update-staff/:id", UpdateStaffs)
router.get("/list-category", ListStaffCategory)
router.post("/all-categories", GetAllStaffCategories)
router.get("/staff-details/:id", GetStaffDetails)

export default router;