import winston from "winston";
import config from '.';

const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        serviceName: "car2go-pro",
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",
            level: "info",
            silent: config.node_env === "test",
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            silent: config.node_env === "test",
        }),
        new winston.transports.Console({
            level: "info",
            silent: config.node_env === "test",
        }),
    ],
});

export default logger;
