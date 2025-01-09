import { TSetting } from "./setting.interface";
import Settings from "./setting.model";
import AppError from '../../errors/AppError';


export class SettingService {
    public static async postSettings(payload: Partial<TSetting>) {
        await Settings.findOneAndUpdate({}, payload, {upsert: true})
    };

    public static async getSiteSettings(query: Record<string, any>) {
        const settings = await Settings.aggregate([
            {
                $project: {
                    _id: 1,
                    site_name: 1,
                    email: 1,
                    phone: 1,
                    otp_verification_type: 1,
                    logo: 1,
                    footer: 1,
                    description: 1,
                    currency_symbol: 1,
                    currency_code: 1,
                    address: 1,
                }
            }
        ]) as TSetting[];
        if (settings.length === 0) {
            throw new AppError(404, 'Request failed', 'Settings not found!');
        }
        return settings[0];
    };

    public static async getSettings() {
        const settings = await Settings.findOne().lean();
        return settings;
    };

    public static async getSettingsBySelect(selects: string) {
        const settings = await Settings.findOne({}).select(selects).lean();
        if (!settings) {
            throw new AppError(
                404,
                "Request failed",
                "Setting data not found!"
            )
        }
        return settings;
    }
}