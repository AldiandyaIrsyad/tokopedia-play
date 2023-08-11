import { useAxios } from '../../../hooks';
import { useState, useEffect } from 'react';

// generouted get name from url
import { useParams } from 'react-router-dom';

export default function index() {
  const axios = useAxios();

  const [video, setVideo] = useState(null);

  const { id } = useParams();

  const getVideo = async () => {
    const { data } = await axios.get(`/api/video/${id}`);
    console.log(data);

    setVideo(data);
  };

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(video, null, 2)}</pre>
    </div>
  );
}
