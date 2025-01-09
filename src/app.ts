import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression'
import helmet from 'helmet'
import config from './app/config';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';


// app initialization
const app = express();
app.use(cookieParser())

// route logs
if (config.node_env === "dev") {
  app.use(morgan("tiny"));
  console.log("Morgan connected..");
}

// middlewares
app.use(compression())
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //* will allow from all cross domain
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  )
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  next()
});
app.use(cors({ credentials: true }));

// API routes
app.use('/api/v1', router);

// general response
app.get('/', (req, res) => {
  return res.status(200).json({ success: true, message: "You're Welcome to Curora💥" })
})

// Global error handle
app.use(globalErrorHandler)

// handle unknown api
app.use(notFound)

// export default app;
export {
  app,
}