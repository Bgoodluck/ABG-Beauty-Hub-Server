import express from 'express';
import { 
    registerSubscription,
    sendSubscriptions,
    listSubscriptions,
    unSubscribeUser,
    deleteSubscriber,
    subscriberStatus
} from "../controllers/subscribeController.js";

const router = express.Router();

router.post("/register", registerSubscription);
router.post("/send", sendSubscriptions);
router.get("/list", listSubscriptions);
router.post("/unsubscribe", unSubscribeUser);
router.delete("/delete/:email", deleteSubscriber);
router.post("/status/:email", subscriberStatus);

export default router;