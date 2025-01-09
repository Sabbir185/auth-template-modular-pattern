import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { SettingValidations } from './setting.validation';
import { SettingControllers } from './setting.controller';


const router = express.Router();

router.post('/',
    auth('admin', 'employee'),
    validateRequest(SettingValidations.postSettingValidationSchema),
    SettingControllers.postSettings
);

router.get('/',
    auth('admin', 'employee'),
    SettingControllers.getSettings
);

router.get('/site',
    SettingControllers.getSiteSettings
);


export const settingRoutes = router;