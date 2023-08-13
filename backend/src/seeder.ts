// insert all model
import { IUser, IUserModel, UserModel } from './module/user/user.model';
import {
  IProduct,
  IProductModel,
  ProductModel,
} from './module/product/product.model';
import { IVideo, IVideoModel, VideoModel } from './module/video/video.model';
import {
  IComment,
  ICommentModel,
  CommentModel,
} from './module/comment/comment.model';

interface ISeeding {
  userModelInstance: IUserModel;
  productModelInstance: IProductModel;
  videoModelInstance: IVideoModel;
  commentModelInstance: ICommentModel;
}

export async function Seeding(
  userModelInstance: IUserModel,
  productModelInstance: IProductModel,
  videoModelInstance: IVideoModel,
  commentModelInstance: ICommentModel
) {
  
  const users = [];
  const products = [];
  const videos = [];
  const comments = [];

  const insertUser = [];

  for (let i = 1; i <= 2; i++) {
    const user = {
      username: `user${i}`,
      email: `user${i}@example.com`,
      role: 'user',
      description: `user${i} description`,
      password: `password`,
    } as IUser;

    insertUser.push(user);

    const createdUser = await userModelInstance.create(user);
    users.push(createdUser);
  }

  // const createdUsers = await userModelInstance.createMany(insertUser);
  // users.push(...createdUsers);

  const user = {
    username: `admin`,
    email: `admin@gmail.com`,
    role: 'admin',
    description: `admin description`,
    password: `password`,
  } as IUser;

  const createdUser = await userModelInstance.create(user);
  users.push(createdUser);

  const insertVideo = [
    {
      title: 'YOASOBI「アイドル」 Official Music Video',
      thumbnail: 'https://img.youtube.com/vi/ZRtdQ81jPUQ/sddefault.jpg',
      url: 'https://www.youtube.com/watch?v=ZRtdQ81jPUQ',
      user: users[0]._id,
    },
    {
      title: 'Why Gravity is NOT a Force',
      thumbnail: 'https://img.youtube.com/vi/XRr1kaXKBsU/sddefault.jpg',
      url: 'https://www.youtube.com/watch?v=XRr1kaXKBsU',
      user: users[1]._id,
    },
    {
      title: 'Neil deGrasse Tyson Explains Time Dilation',
      thumbnail: 'https://img.youtube.com/vi/1BCkSYQ0NRQ/sddefault.jpg',
      url: 'https://www.youtube.com/watch?v=1BCkSYQ0NRQ',
      user: users[0]._id,
    },
    {
      title: 'General Relativity Explained simply & visually',
      url: 'https://www.youtube.com/watch?v=tzQC3uYL67U',
      thumbnail: 'https://img.youtube.com/vi/tzQC3uYL67U/sddefault.jpg',
      user: users[0]._id,
    },
    {
      title:
        "Quantum Gravity: How quantum mechanics ruins Einstein's general relativity",
      url: 'https://www.youtube.com/watch?v=S3Wtat5QNUA',
      thumbnail: 'https://img.youtube.com/vi/S3Wtat5QNUA/sddefault.jpg',
      user: users[0]._id,
    },
  ];

  for (let i = 0; i < insertVideo.length; i++) {
    const createdVideo = await videoModelInstance.create(insertVideo[i] as any);
    videos.push(createdVideo);
  }

  // const createdVideos = await videoModelInstance.createMany(
  //   insertVideo as any
  // );
  // videos.push(...createdVideos);

  const insertProduct = [
    {
      title:
        'Torch Tas Ransel Punggung Pria Wanita - Backpack Rain Cover Ishikari - Abu-abu',
      url: 'https://www.tokopedia.com/torch-id/torch-tas-ransel-punggung-pria-wanita-backpack-rain-cover-ishikari-abu-abu?src=topads',
      thumbnail_url:
        'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/7/19/bd6a332d-0308-47c5-9a10-d49d93bf4e23.jpg',
      price: 375560,
      video: videos[videos.length - 1]._id,

      user: users[0]._id,
    },
    {
      title: 'Kotak Emas LM Antam - Box Tempat Logam Mulia Premium 1 - Hitam',
      url: 'https://www.tokopedia.com/solic-1/kotak-emas-lm-antam-box-tempat-logam-mulia-premium-1-hitam',
      thumbnail_url:
        'https://images.tokopedia.net/img/cache/900/VqbcmM/2022/6/15/cdf38760-ad53-4b26-9726-c1783e3ab8b2.png',
      price: 49000,
      video: videos[videos.length - 1]._id,

      user: users[0]._id,
    },
    {
      title: 'Box kotak Logam Mulia Beludru Premium dengan tali pengikat',
      url: 'https://www.tokopedia.com/toko-mas-dynasty/box-kotak-logam-mulia-beludru-premium-dengan-tali-pengikat?src=topads',
      thumbnail_url:
        'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/12/27/f27217ab-d634-4d73-bf93-49649427c4d4.png',
      price: 35000,
      // last video id
      video: videos[videos.length - 1]._id,
      user: users[0]._id,
    },
  ];

  for (let i = 0; i < insertProduct.length; i++) {
    const createdProduct = await productModelInstance.create(
      insertProduct[i] as any
    );
    products.push(createdProduct);
  }

  const insertComment = [];

  for (let i = 1; i <= 20; i++) {
    const comment = {
      text: `Hey this is a comment!`,
      user: users[i % 3]._id,
      video: videos[i % 2]._id,
    } as IComment;

    insertComment.push(comment);

    const createdComment = await commentModelInstance.create(comment);
    comments.push(createdComment);
  }
}
