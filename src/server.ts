import mongoose from "mongoose";
import config from './app/config';
import { app } from './app';

async function main() {
    try {
        const DB_String = config.node_env === 'prod' ? config.db_string : config.db_string;
        await mongoose.connect(DB_String as string);
        console.log('Database connected successfully!');
        const PORT = config.node_env === 'prod'? config.port : config.port;
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
}

(async() => {
    await main();
})()

process.on('unhandledRejection', (err: Record<string, unknown>) => {
    console.log(`unhandledRejection is detected , shutting down ...`);
    console.log(err.name, err.message);
    process.exit(1);
});

process.on('uncaughtException', (err: Record<string, unknown>) => {
    console.log(`uncaughtException is detected , shutting down ...`);
    console.log(err.name, err.message);
    process.exit(1);
});