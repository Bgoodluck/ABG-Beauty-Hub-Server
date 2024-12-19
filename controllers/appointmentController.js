import AppointmentModel from "../models/appointmentModel.js";
import mongoose from 'mongoose';

 const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointmentData = {
      ...req.body,
      user: userId
    };

    const newAppointment = new AppointmentModel(appointmentData);
    const savedAppointment = await newAppointment.save();

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: savedAppointment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message
    });
  }
};

 const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await AppointmentModel.find({ user: userId })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: 'User appointments fetched successfully',
      data: appointments
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

 const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    return res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

const getAllAppointments = async (req, res) => {
    try {
      const appointments = await AppointmentModel.find({})
        .sort({ createdAt: -1 });
      
      return res.json({ 
        success: true, 
        message: 'All appointments fetched successfully', 
        data: appointments 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching appointments', 
        error: error.message 
      });
    }
  };
  


const getSingleAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid appointment ID',
        });
      }
  
      // Find the appointment and ensure it belongs to the user
      const appointment = await AppointmentModel.findOne({ 
        _id: id, 
        user: userId 
      });
  
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }
  
      return res.json({
        success: true,
        message: 'Appointment fetched successfully',
        data: appointment
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching appointment',
        error: error.message
      });
    }
  };

  const updateAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      // Find and update the appointment, ensuring it belongs to the user
      const updatedAppointment = await AppointmentModel.findOneAndUpdate(
        { _id: id, user: userId },
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found or you are not authorized to modify this appointment'
        });
      }
  
      return res.json({
        success: true,
        message: 'Appointment updated successfully',
        data: updatedAppointment
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error updating appointment',
        error: error.message
      });
    }
  };


  const adminUpdateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        // Validate status
        const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status' 
            });
        }

        // Find and update the appointment
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            id,
            { 
                status, 
                adminNotes: notes,
                lastUpdatedBy: req.user.id // Assuming you have user authentication middleware
            },
            { new: true, runValidators: true }
        ).populate('user', 'email firstName lastName');

        if (!updatedAppointment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        // Send email notification
        if (updatedAppointment.user && updatedAppointment.user.email) {
            try {
                await sendAppointmentStatusUpdateEmail({
                    email: updatedAppointment.user.email,
                    firstName: updatedAppointment.user.firstName,
                    appointmentDate: updatedAppointment.requestDate,
                    newStatus: status,
                    notes
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // We don't want to fail the entire request if email fails
            }
        }

        return res.json({ 
            success: true, 
            message: 'Appointment status updated successfully', 
            data: updatedAppointment 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error updating appointment status', 
            error: error.message 
        });
    }
};

// Email notification function
const sendAppointmentStatusUpdateEmail = async (details) => {
    try {
        const emailContent = `
            Dear ${details.firstName},

            The status of your appointment on ${new Date(details.appointmentDate).toLocaleDateString()} 
            has been updated to: ${details.newStatus}

            ${details.notes ? `Additional Notes: ${details.notes}` : ''}

            Thank you,
            Your Salon Team
        `;

        // Use your email sending service (e.g., nodemailer, SendGrid)
        await sendEmail({
            to: details.email,
            subject: 'Appointment Status Update',
            text: emailContent
        });
    } catch (error) {
        console.error('Failed to send status update email', error);
        throw error; // Rethrow to be caught in the main function
    }
};


 export { 
    bookAppointment, 
    getUserAppointments, 
    updateAppointmentStatus, 
    getAllAppointments, 
    getSingleAppointment,
    updateAppointment, 
    adminUpdateAppointmentStatus 
};