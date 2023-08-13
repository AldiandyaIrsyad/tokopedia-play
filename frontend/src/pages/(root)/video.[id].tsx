import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useAxios, useVideo } from '../../hooks';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function video() {
  const { id } = useParams();
  const axios = useAxios();
  const video = useVideo(id as string);

  const [comments, setComments] = useState<IComment[]>([]);

  const getComments = async () => {
    const { data } = await axios.get('/api/comment/video/' + id);
    setComments(data.slice(-25));
  };

  useEffect(() => {
    getComments();

    // connect to socket
    const connectSocket = () => {
      const socket = io('http://localhost:5000/');
      socket.on('connect', () => {
        console.log('connected');
      });

      socket.on('newComment', (comment: IComment) => {
        console.log(comment);
        setComments((prev) => [...prev, comment].slice(-25));

        // scroll to bottom
        const commentsDiv = document.getElementById('comments');
        commentsDiv?.scrollTo(0, commentsDiv.scrollHeight - 100);
      });
    };

    connectSocket();
  }, []);

  const postComment = async (text: string) => {
    await axios.post('/api/comment', {
      text,
      videoId: id,
    });
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    await postComment(values.text);
    resetForm();
  };

  return (
    <div className="flex-1 flex  ">
      <div className="flex-1 h-full flex flex-col ">
        <div className="flex justify-center  py-4">
          <iframe
            height="540"
            width="960"
            src={video.url}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="block "
          ></iframe>
        </div>

        {/* horizontal */}
        <div>
          <div className="flex justify-center max-w-full gap-5  ">
            {video.products?.map((product: any) => (
              <Product product={product} key={product._id} />
            ))}
          </div>
        </div>
      </div>

      <div className="w-96 h-full border-l-2 py-2 px-4">
        <div className="flex flex-col h-full ">
          <div className="flex-1  ">
            <div
              id="comments"
              className="h-full overflow-y-scroll "
              style={{
                maxHeight: 'calc(100vh - 200px)',
              }}
            >
              {comments?.map((comment: any) => (
                <Comment comment={comment} key={comment._id} />
              ))}
            </div>
          </div>

          <div className="h-95">
            <Formik
              initialValues={{
                text: '',
              }}
              onSubmit={handleSubmit}
            >
              <Form className="flex flex-col h-full">
                <Field
                  name="text"
                  as="textarea"
                  className="h-full resize-none outline outline-neutral-400"
                />

                <button type="submit">submit</button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

function Product({ product }: any) {
  return (
    <a href={product.url} className="w-32 shadow-md">
      <div className="flex flex-col">
        <div className="flex justify-center">
          <img src={product.thumbnail_url} alt="" />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center">
            {product.title.substring(0, 25) +
              (product.title.length > 25 ? '...' : '')}
          </div>
        </div>
      </div>
    </a>
  );
}

function Comment({ comment }: any) {
  return (
    <div className="">
      <div className="">
        <span className="text-green-900 font-semibold">
          {comment.user.username}:{' '}
        </span>
        {comment.text}
      </div>
    </div>
  );
}

interface IComment extends Document {
  _id?: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  user?: any;
  video?: any;
}
