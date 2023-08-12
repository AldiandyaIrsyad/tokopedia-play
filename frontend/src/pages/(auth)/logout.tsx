import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '@/hooks';

const Logout = () => {
  const navigate = useNavigate();
  const axios = useAxios();

  useEffect(() => {
    const clearCookie = async () => {
      await axios.get('/api/user/logout');
      navigate('/');
    };
    clearCookie();
  }, [history]);

  return null;
};

export default Logout;
