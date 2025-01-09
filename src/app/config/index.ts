import dotenv from 'dotenv';
import path from 'path';

// eslint-disable-next-line no-undef
const pathData = path.join(__dirname, `../../../.env.${process.env.NODE_ENV}`)
dotenv.config({ path: pathData });

export default {
    node_env: process.env.NODE_ENV,
    website_name: process.env.WEBSITE_NAME,

    port: process.env.PORT,
    db_string: process.env.DB_STRING,

    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,

    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
}