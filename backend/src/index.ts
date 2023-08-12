import dotenv from 'dotenv';
import mongoose from './database/db';
import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

// import everything in api/user
import {
  UserModel,
  UserService,
  UserController,
  UserRouter,
} from './module/user';
import {
  VideoModel,
  VideoService,
  VideoController,
  VideoRouter,
} from './module/video';

import {
  CommentModel,
  CommentService,
  CommentController,
  CommentRouter,
  CommentSocket,
} from './module/comment/';

import {
  ProductModel,
  ProductService,
  ProductController,
  ProductRouter,
} from './module/product/';

import http from 'http';

const app = express();
const server = http.createServer(app);

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

const commentSocketInstance = new CommentSocket(server);
const commentModelInstance = new CommentModel(mongoose.connection);
const commentServiceInstance = new CommentService(
  commentModelInstance,
  userModelInstance,
  videoModelInstance,
  commentSocketInstance
);
const commentControllerInstance = new CommentController(commentServiceInstance);

const commentRouterInstance = new CommentRouter(commentControllerInstance);

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/video', videoRouterInstance.getRouter());
app.use('/api/user', userRouterInstance.getRouter());
app.use('/api/product', productRouterInstance.getRouter());
app.use('/api/comment', commentRouterInstance.getRouter());

server.listen(5000, () => {
  console.log('Server started');
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB', err);
  process.exit(1);
});
