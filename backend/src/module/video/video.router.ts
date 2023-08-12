import express from 'express';
import { IVideoController } from './video.controller';

export class VideoRouter {
  private router: express.Router;
  private controller: IVideoController;

  constructor(controller: IVideoController) {
    this.router = express.Router();
    this.controller = controller;

    this.initRoutes();

    //
  }

  public getRouter(): express.Router {
    return this.router;
  }

  private initRoutes(): void {
    this.router.get('/', this.controller.getAllVideos);
    this.router.get('/:id', this.controller.getVideoById);
    this.router.post('/', this.controller.createVideo);
    this.router.get('/user/:id', this.controller.getVideosByUserId);
  }
}
