import { IProductService } from './product.service';

import { Request, Response } from 'express';

import { getErrorMessage } from '../../helpers/getErrorMessage';

export interface IProductController {
  getAllProducts(req: Request, res: Response): Promise<void>;
  getProductById(req: Request, res: Response): Promise<void>;
  createProduct(req: Request, res: Response): Promise<void>;
  getProductsByUserId(req: Request, res: Response): Promise<void>;
  getProductsByVideoId(req: Request, res: Response): Promise<void>;
}

export class ProductController implements IProductController {
  private productService: IProductService;

  constructor(productService: IProductService) {
    this.productService = productService;

    // bind
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.getProductsByUserId = this.getProductsByUserId.bind(this);
    this.getProductsByVideoId = this.getProductsByVideoId.bind(this);
  }

  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAll();

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.getById(req.params.id);

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.cookies;

      const { title, url, thumbnail, videoId } = req.body;

      const product = await this.productService.create(
        title,
        url,
        thumbnail,
        token,
        videoId
      );

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }

  public async getProductsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const products = await this.productService.getProductsByUserId(id);

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }

  public async getProductsByVideoId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { videoId } = req.params;

      const products = await this.productService.getProductsByVideoId(videoId);

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }
}
