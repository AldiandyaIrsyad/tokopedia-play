import { getUserIdFromToken } from '../../helpers/getUserIdFromToken';

import { IProduct, IProductModel } from './product.model';
import { IUserModel } from '../user';
import { IVideoModel } from '../video';

export interface IProductService {
  create: (
    title: string,
    url: string,
    thumbnail_url: string,
    token: string,
    videoId: string
  ) => Promise<IProduct>;
  getAll: () => Promise<IProduct[]>;
  getById: (_id: string) => Promise<IProduct>;
  getProductsByUserId: (userId: string) => Promise<IProduct[]>;
  getProductsByVideoId: (videoId: string) => Promise<IProduct[]>;
  searchProducts: (text: string) => Promise<IProduct[]>;
}

export class ProductService implements IProductService {
  private readonly productModel: IProductModel;
  private readonly userModel: IUserModel;
  private readonly videoModel: IVideoModel;

  constructor(
    productModel: IProductModel,
    userModel: IUserModel,
    videoModel: IVideoModel
  ) {
    this.productModel = productModel;
    this.userModel = userModel;
    this.videoModel = videoModel;
  }

  public async create(
    title: string,
    url: string,
    thumbnail_url: string,
    token: string,
    videoId: string
  ): Promise<IProduct> {
    const userId = getUserIdFromToken(token);
    const user = await this.userModel.getById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const video = await this.videoModel.getById(videoId);

    if (!video) {
      throw new Error('Video not found');
    }

    const product = await this.productModel.create({
      title,
      url,
      thumbnail_url,
      user,
      video,
    } as IProduct);

    return product;
  }

  public async getAll(): Promise<IProduct[]> {
    const products = await this.productModel.getAll();

    return products;
  }

  public async getById(_id: string): Promise<IProduct> {
    const product = await this.productModel.getById(_id);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  public async getProductsByUserId(userId: string): Promise<IProduct[]> {
    const products = await this.productModel.getProductsByVideoId(userId);

    return products;
  }

  public async getProductsByVideoId(videoId: string): Promise<IProduct[]> {
    const products = await this.productModel.getProductsByVideoId(videoId);

    if (!products) {
      throw new Error('Products not found');
    }

    return products;
  }

  public async searchProducts(text: string): Promise<IProduct[]> {
    const products = await this.productModel.searchProductsByTitle(text);

    if (!products) {
      throw new Error('Products not found');
    }

    return products;
  }
}
