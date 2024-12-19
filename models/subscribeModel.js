import mongoose from "mongoose";


const subscriberSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  });


  const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);

  export default Subscriber;