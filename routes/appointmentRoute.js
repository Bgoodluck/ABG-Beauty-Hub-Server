// import express from 'express';
// import {
//   bookAppointment,
//   getUserAppointments,
//   updateAppointmentStatus,
//   getAllAppointments,
//   getSingleAppointment,
//   updateAppointment,
//   adminUpdateAppointmentStatus 
// } from '../controllers/appointmentController.js';
// import authUser from '../middleware/auth.js';
// import adminAuth from '../middleware/adminAuth.js';


// const router = express.Router();

// // Protected routes (require authentication)
// router.post('/book', authUser, bookAppointment);
// router.get('/user', authUser, getUserAppointments);
// router.put('/:id/status', authUser, updateAppointmentStatus);
// router.get('/:id', authUser, getSingleAppointment);
// router.put('/edit/:id', authUser, updateAppointment);

// // Admin route (requires additional admin middleware)
// router.get('/all',adminAuth, getAllAppointments);
// router.put('/admin/:id/status', adminAuth, adminUpdateAppointmentStatus);

// export default router;



import express from 'express';
import {
  bookAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  getAllAppointments,
  getSingleAppointment,
  updateAppointment,
  adminUpdateAppointmentStatus 
} from '../controllers/appointmentController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/book', authUser, bookAppointment);
router.get('/user', authUser, getUserAppointments);
router.put('/:id/status', authUser, updateAppointmentStatus);
router.put('/edit/:id', authUser, updateAppointment);

// Admin route (requires additional admin middleware)
router.get('/all', authUser, getAllAppointments); // Place specific route first
router.put('/admin/:id/status', authUser, adminUpdateAppointmentStatus);

// Dynamic route (must come last to avoid conflicts)
router.get('/:id', authUser, getSingleAppointment);

export default router;
