# Tokopedia Play MVP

Tokopedia play is a simple website to share video related to products that are being selled.

Deployment: http://52.74.148.120:5173/

Note: only in last video there are products.

## Bonuses

First I want to mention that I have several bonuses done:

1. Adding username on top right corner
1. Use websocket for realtime comment
1. Search video based on title.

Other than that I have also done:

1. Authentication using Bcrypt, JWT Token on HTTP only cookie.
1. Create additional API to create video, product.
1. Using token for comment instead of inserting username manually
1. Automatically add views when user click on video.
1. Creating register page.

## How to run

You can run the application using Dockerfile that is enter the following code

```
docker-compose build
docker-compose up
```

You can run without using docker by running the following code

```
npm install
npm install --prefix frontend
npm run both
```

please note that you need to setup your own `.env` file. You can use `.env.example` immediately.

Also please note using seed=true will wipe the database.

This will run dev on both frontend and backend using concurrently

## Technologies

I'm using `Typescript` with `MERN` stack and `tailwind` as my CSS library. To connect frontend and backend ASAP I use cors. I use concurrently to run most of the project. For routing in react I'm using `react-router-dom` with a vite extension called `generouted` to create folder/file based routing _similar_ to `nextjs`.

For form I'm using `formik` and `yup` for validation. I'm also using `socket.io` to abstract websocket.

I use proxy in `vite.config.ts` for base url. I'm deploying the database at mongodb atlas, and the server at AWS Lightsail instance. I expose 5173 port for the server and have attached a static IP. Besides that I'm using systemd to run the server as a service.

```
[Unit]
Description=MyApp server
After=network.target

[Service]
Type=simple
User=bitnami
WorkingDirectory=/home/bitnami/tokopedia-play
ExecStart=/opt/bitnami/node/bin/node backend/dist/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

```
[Unit]
Description=MyApp Frontend
After=network.target

[Service]
Type=simple
User=bitnami
Environment="node=/opt/bitnami/node/bin/node"
WorkingDirectory=/home/bitnami/tokopedia-play
ExecStart=/opt/bitnami/node/bin/npm run preview --prefix frontend
Restart=always


[Install]
WantedBy=multi-user.target
```

Please note that using `npm run preview` isn't really recommended for production. I'm only using it for simplicity sake.

## API

### User

```TS
interface IUser {
  _id?: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  description: string;
  password?: string;
  videos?: IVideo[];
  comments?: IComment[];
  products?: IProduct[];
  comparePassword(password: string): Promise<boolean>;
}
```

#### POST api/user/register

- URL Params
  - None
- Data Params
  - username: string
  - email: string
  - password: string
- Success Response:
  - Code: 201
  - Cookie: token
  - Content:
    ```TS
    {}
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

#### POST api/user/login

- URL Params
  - None
- Data Params
  - email: string
  - password: string
- Success Response:
  - Code: 200
  - Cookie: token
  - Content:
    ```TS
    {}
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

#### GET api/user/logout

- URL Params
  - None
- Data Params
  - None
- Success Response:
  - Code: 200
  - Content:
    ```TS
    {}
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

#### GET api/user/me

- URL Params
  - None
- Data Params
  - None
- Headers
  - Cookie: token
- Success Response:
  - Code: 200
  - Content:
    ```TS
    {
      user: IUser
    }
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

#### GET api/user/:id

- URL Params
  - id: string
- Data Params
  - None
- Success Response:
  - Code: 200
  - Content:
    ```TS
    {
      user: IUser (populated)
    }
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

### Video

```typescript
interface IVideo {
  _id?: string;
  title: string;
  thumbnail: string;
  url: string;
  views?: number;
  createdAt?: Date;
  user?: IUser;
  comments?: IComment[];
  products?: IProduct[];
}
```

#### GET api/video

- URL Params
  - None
- Data Params
  - None
- Success Response:
  - Code: 200
  - Content:
    ```TS
    {
      videos: IVideo[]
    }
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

#### GET api/video/:id

- URL Params
  - id: string
- Data Params
  - None
- Success Response:
  - Code: 200
  - Content:
    ```TS
    {
      video: IVideo (populated)
    }
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

### Comment

```TS
interface IComment {
  _id?: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  user?: IUser;
  video?: IVideo;
}
```

#### GET api/comment

- URL Params
  - None
- Data Params
  - None
- Success Response:
  - Code: 200
  - Content:
    ```TS
    {
      comments: IComment[]
    }
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

#### get api/comment/:id

- URL Params
  - id: string
- Data Params
  - None
- Success Response:
  - Code: 200
  - Content:
    ```TS
    {
      comment: IComment (populated)
    }
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

#### get api/comment/video/:id

- URL Params
  - id: string
- Data Params
  - None
- Success Response:
  - Code: 200
  - Content:
    ```TS
    {
      comments: IComment[] (populated)
    }
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

#### POST api/comment

- URL Params
  - None
- Data Params
  - text: string
  - video: string
- Success Response:
  - Code: 201
  - Content:
    ```TS
    {
      comment: IComment (populated)
    }
    ```
- Error Response:
  - Code: 400
  - Content:
    ```TS
    {
      message: string
    }
    ```

## TODO

There are still couple of things that need to be done. That I decided to not do because of time constraint. Although there are some code that I've written to prepare for it such as:

1. User able to create video, product.
1. User be able to like comment
1. User be able to search video based on products title

If I have more time these are the things that I would do:

1. Refactor backend similar to comment.service and reduce bind.
1. Refactor backend using type, omit to reduce boilerplate and make it easier to read.
1. Re-add unit testing using JEST (I've removed it because I have changed to model code a lot of times and I don't have time to update the test)
1. Using dependency injection library such as typedi to reduce boilerplate.
