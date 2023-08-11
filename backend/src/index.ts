import dotenv from 'dotenv';
import mongoose from './database/db';
import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

// import everything in api/user
import { UserModel, UserService, UserController, UserRouter } from './api/user';
import {
  VideoModel,
  VideoService,
  VideoController,
  VideoRouter,
} from './api/video';

import { CommentModel } from './api/comment/comment.model';
import {
  ProductModel,
  ProductService,
  ProductController,
  ProductRouter,
} from './api/product/';

const userModelInstance = new UserModel(mongoose.connection);
const userServiceInstance = new UserService(userModelInstance);
const userControllerInstance = new UserController(userServiceInstance);
const userRouterInstance = new UserRouter(userControllerInstance);

const videoModelInstance = new VideoModel(mongoose.connection);
const videoServiceInstance = new VideoService(
  videoModelInstance,
  userModelInstance
);
const videoControllerInstance = new VideoController(videoServiceInstance);
const videoRouterInstance = new VideoRouter(videoControllerInstance);

const productModelInstance = new ProductModel(mongoose.connection);
const productServiceInstance = new ProductService(
  productModelInstance,
  userModelInstance,
  videoModelInstance
);
const productControllerInstance = new ProductController(productServiceInstance);

const productRouterInstance = new ProductRouter(productControllerInstance);

const commentModelInstance = new CommentModel(mongoose.connection);

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/video', videoRouterInstance.getRouter());
app.use('/api/user', userRouterInstance.getRouter());
app.use('/api/product', productRouterInstance.getRouter());

app.listen(5000, () => {
  console.log('Server started');
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB', err);
  process.exit(1);
});
