import mongoose from './database/db';

// insert all model
import { IUser, IUserModel, UserModel } from './api/user/user.model';
import {
  IProduct,
  IProductModel,
  ProductModel,
} from './api/product/product.model';
import { IVideo, IVideoModel, VideoModel } from './api/video/video.model';
import {
  IComment,
  ICommentModel,
  CommentModel,
} from './api/comment/comment.model';

const userModelInstance = new UserModel(mongoose.connection);
const productModelInstance = new ProductModel(mongoose.connection);
const videoModelInstance = new VideoModel(mongoose.connection);
const commentModelInstance = new CommentModel(mongoose.connection);

// insert 2 user
// export interface IUser extends Document {
//   username: string;
//   email: string;
//   role: 'admin' | 'user';
//   description: string;
//   password?: string;
//   videos?: IVideo[];
//   comments?: IComment[];
//   products?: IProduct[];
//   comparePassword(password: string): Promise<boolean>;
// }

async function Seeding() {
  const users = [];
  const products = [];
  const videos = [];
  const comments = [];

  for (let i = 1; i <= 5; i++) {
    const user = {
      username: `user${i}`,
      email: `user${i}@gmail.com`,
      role: 'user',
      description: `user${i} description`,
      password: `password`,
    } as IUser;

    const createdUser = await userModelInstance.create(user);
    users.push(createdUser);
  }

  const user = {
    username: `admin`,
    email: `admin@gmail.com`,
    role: 'admin',
    description: `admin description`,
    password: `password`,
  } as IUser;

  const createdUser = await userModelInstance.create(user);
  users.push(createdUser);

  const videoUrls = [
    'https://www.youtube.com/watch?v=Kmlfy4svwuM',
    'https://www.youtube.com/watch?v=WtkI-QAgM6w',
    'https://www.youtube.com/watch?v=880TBXMuzmk',
    'https://www.youtube.com/watch?v=xpUIZ32n9nw',
    'https://www.youtube.com/watch?v=XRr1kaXKBsU',
  ];

  for (let i = 1; i <= 20; i++) {
    const randomColorHex = Math.floor(Math.random() * 16777215).toString(16);
    const video = {
      title: `video${i}`,
      thumbnail: `https://dummyimage.com/320x180/000/${randomColorHex}.png`,
      user: users[(i % 5) + 1]._id,
      url: videoUrls[i % 5],
    } as IVideo;

    const createdVideo = await videoModelInstance.create(video);
    videos.push(createdVideo);
  }

  const urls = [
    'https://www.tokopedia.com/eceran-harga-grosir/lampu-led-bohlam-5-10-15-20-30w-bulb-kapsul-pioline-alpha-murah-sni-20-watt?source=homepage.left_carousel.0.281097',
    'https://www.tokopedia.com/rizkiqu/mangkok-batok-kelapa-natural-tanpa-kaki?source=homepage.left_carousel.0.281097',
    'https://www.tokopedia.com/ganidhan07/singabera-premium-original-ginger-drink-12-sachet?source=homepage.left_carousel.0.281097',
    'https://www.tokopedia.com/stilettoliving/docking-station-desk-organizer-tempat-hp-rak-kunci-tempat-jam-tangan-natural?source=homepage.left_carousel.0.281097',
  ];

  for (let i = 1; i <= 20; i++) {
    const randomColorHex = Math.floor(Math.random() * 16777215).toString(16);
    const product = {
      title: `product${i}`,
      thumbnail_url: `https://dummyimage.com/320x180/000/${randomColorHex}.png`,
      url: urls[i % 4],
      video: videos[(i % 5) + 1]._id,
    } as IProduct;

    product.user = videos[(i % 5) + 1].user;

    const createdProduct = await productModelInstance.create(product);
    products.push(createdProduct);
  }

  for (let i = 1; i <= 20; i++) {
    const comment = {
      text: `comment${i}`,
      user: users[(i % 5) + 1]._id,
      video: videos[(i % 5) + 1]._id,
    } as IComment;

    const createdComment = await commentModelInstance.create(comment);
    comments.push(createdComment);
  }

  process.exit(0);
}

Seeding();

// exist
