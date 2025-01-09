import express from 'express';
import { UserValidations } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { USER_ROLE_ENUM } from './user.constant';

const router = express.Router();

router.post('/register',
    validateRequest(UserValidations.registerValidationSchema),
    UserController.registerNewAccount
)
router.get('/profile',
    auth(...USER_ROLE_ENUM),
    UserController.getUserProfile
)
router.patch('/profile',
    auth(...USER_ROLE_ENUM),
    UserController.userProfileUpdate
)
router.delete('/profile',
    auth(...USER_ROLE_ENUM),
    UserController.userProfileDelete
)

export const userRoutes = router;