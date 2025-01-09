import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE_ENUM } from '../user/user.constant';

const router = express.Router();

router.post('/identification/check', AuthController.checkUserIdentifier)
router.post('/login',
    validateRequest(authValidations.userLoginValidationSchema),
    AuthController.loginAccess
)
router.post('/refresh-token',
    validateRequest(authValidations.refreshTokenValidationSchema),
    AuthController.refreshToken
)
router.post('/forget-password/send-otp', AuthController.forgetPasswordOTPSend)
router.post('/forget-password/verify-otp', AuthController.forgetPasswordOTPVerify)
router.post(
    '/forget-password/submit',
    auth(...USER_ROLE_ENUM),
    AuthController.forgetPasswordSubmitTokenBased
)
router.post(
    '/password-update',
    validateRequest(authValidations.passwordUpdateValidationSchema),
    auth(...USER_ROLE_ENUM),
    AuthController.userPasswordUpdate
)

export const authRoutes = router;