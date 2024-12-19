// const uploadProductPermission = require("../helpers/permission");
// const ProductModel = require("../models/uploadProductModel");
import StaffModel from "../models/staffModel.js";

export const UploadStaffs = async(req, res)=>{

    try {

        // const sessionUserId = req.user;

        // if (!uploadProductPermission(sessionUserId)) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Unauthorized to upload products"
        //     });
            
        // }
        
        const { staffName, 
                staffPrice, 
                staffDescription, 
                staffCategory,
                staffBrand, 
                staffImage, 
                staffDiscount 
            } = req.body;


        if(!staffName ||!staffPrice ||!staffDescription ||!staffCategory ||!staffBrand ||!staffImage ||!staffDiscount){
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        
        const staff = new StaffModel({
            staffName,
            staffPrice,
            staffDescription,
            staffCategory,
            staffBrand,
            staffImage,
            staffDiscount
        });

        const savedstaff = await staff.save();

        return res.json({
            success: true,
            message: "staff Uploaded successfully",
            data: savedstaff
          })
        
    }  catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error uploading staff",
            error: error.message
        });
      }
}

export const GetStaffs = async(req, res)=>{
    try {

        const allStaffs = await StaffModel.find({}).sort({ createdAt : -1 });
        return res.json({
            success: true,
            message: "Staffs fetched successfully",
            data: allStaffs
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching staffs",
            error: error.message
        });
      }
}


export const UpdateStaffs = async(req,res)=>{
    try {

        // const sessionUserId = req.user;

        const staffId = req.params.id;

        const { staffName, 
                staffPrice, 
                staffDescription, 
                staffCategory, 
                staffBrand, 
                staffImage, 
                staffDiscount 
            } = req.body;
        
        // if (!uploadProductPermission(sessionUserId)) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Unauthorized to update products"
        //     });
        // }
        
        if(!staffName ||!staffPrice ||!staffDescription ||!staffCategory ||!staffBrand ||!staffImage ||!staffDiscount){
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const updatedStaff = await StaffModel.findByIdAndUpdate(staffId, {
            staffName,
            staffPrice,
            staffDescription,
            staffCategory,
            staffBrand,
            staffImage,
            staffDiscount
        }, { new: true });

        if (!updatedStaff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        return res.json({
            success: true,
            message: "Staff updated successfully",
            data: updatedStaff
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error updating staffs",
            error: error.message
        });
      }
}


export const ListStaffCategory = async(req, res)=>{

    try {

        const allStaffsCategory = await StaffModel.distinct("staffCategory");
        console.log("category", allStaffsCategory)        
        
        /**this array is to store one product from each category**/ 
        const staffByCategory = [];

        for (let category of allStaffsCategory) {
            const staff = await StaffModel.findOne({ staffCategory: category });
            
            if (staff) {
                staffByCategory.push(staff);
            }
        }
        return res.json({
            success: true,
            message: "Category Staffs fetched successfully",
            data: staffByCategory
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error listing Category",
            error: error.message
        });
      }
}

export const GetAllStaffCategories = async(req, res)=>{

    try {

        const { staffCategory } = req?.body || req.query;

        if (!staffCategory) {
            return res.status(400).json({
                success: false,
                message: "Please select a category"
            });
        }

        const allStaffsCategory = await StaffModel.find({staffCategory});
        return res.json({
            success: true,
            message: "All Category staffs fetched successfully",
            data: allStaffsCategory
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error getting all categories",
            error: error.message
        });
      }
}


export const GetStaffDetails = async(req, res)=>{

    try {

        const staffId = req.params.id;

        if (!staffId) {
            return res.status(400).json({
                success: false,
                message: "Please provide a staff ID"
            });
        }

        const staffDetails = await StaffModel.findById(staffId);

        if (!staffDetails) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        return res.json({
            success: true,
            message: "Staff details fetched successfully",
            data: staffDetails
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error getting all staff details",
            error: error.message
        });
      }
}