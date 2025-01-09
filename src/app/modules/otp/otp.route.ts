import express from 'express';
import { OTPController } from './otp.controller';

const router = express.Router();

router.post('/send', OTPController.sendOTP);
router.post('/verify', );

export const otpRoutes = router;
