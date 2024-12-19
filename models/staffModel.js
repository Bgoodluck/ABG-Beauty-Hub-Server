import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
    staffName: {
        type: String        
    },
    staffPrice: {
        type: Number        
    },
    staffDescription: {
        type: String        
    },
    staffCategory: {
        type: String        
    },
    staffBrand: {
        type: String        
    },
    staffImage: [],
    staffDiscount:{
        type: Number
    }
    
}, {timestamps : true})

const StaffModel = mongoose.models.StaffModel || mongoose.model("staff", StaffSchema);

export default StaffModel;