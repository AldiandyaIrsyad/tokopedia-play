import express from 'express';
import { IProductController } from './product.controller';

export class ProductRouter {
  private router: express.Router;
  private controller: IProductController;

  constructor(controller: IProductController) {
    this.router = express.Router();
    this.controller = controller;

    this.initRoutes();
  }

  public getRouter(): express.Router {
    return this.router;
  }

  private initRoutes(): void {
    this.router.get('/', this.controller.getAllProducts);
    this.router.get('/:id', this.controller.getProductById);
    this.router.post('/', this.controller.createProduct);
    this.router.get('/user/:id', this.controller.getProductsByUserId);
    this.router.get('/video/:id', this.controller.getProductsByVideoId);
  }
}
