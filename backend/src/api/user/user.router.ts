import express from 'express';
import { IUserController } from './user.controller';

export class UserRouter {
  private router: express.Router;
  private controller: IUserController;

  constructor(controller: IUserController) {
    this.router = express.Router();
    this.controller = controller;

    this.initRoutes();

    //
  }

  public getRouter(): express.Router {
    return this.router;
  }

  private initRoutes(): void {
    this.router.get('/', this.controller.getAllUsers);
    this.router.get('/:id', this.controller.getUserById);
    this.router.post('/login', this.controller.login);
    this.router.post('/register', this.controller.register);
    this.router.get('/me', this.controller.getMe);
  }
}
