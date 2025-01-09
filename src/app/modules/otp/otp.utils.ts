export function generateOTP(length = 4) {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export const formatPhoneNumber = (phoneNumber: string) => {
    const regex = /^(\+|00)/;
    const formattedNumber = phoneNumber.replace(regex, '');
    return +formattedNumber;
}
