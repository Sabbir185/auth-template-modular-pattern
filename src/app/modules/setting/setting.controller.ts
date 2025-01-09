import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SettingService } from './setting.service';


const postSettings = catchAsync(async (req, res) => {
    const { body } = req;
    await SettingService.postSettings(body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Settings updated successfully',
        data: null
    })
})

const getSiteSettings = catchAsync(async (req, res) => {
    const { query } = req;
    const result = await SettingService.getSiteSettings(query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Site settings retrieved successfully',
        data: result
    })
})

const getSettings = catchAsync(async (req, res) => {
    const result = await SettingService.getSettings()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Settings retrieved successfully',
        data: result
    })
})


export const SettingControllers = {
    postSettings,
    getSiteSettings,
    getSettings,
}