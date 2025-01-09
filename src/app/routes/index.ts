import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";
import { settingRoutes } from "../modules/setting/setting.route";
import { otpRoutes } from "../modules/otp/otp.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/otp',
        route: otpRoutes
    },
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/settings',
        route: settingRoutes
    },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router;