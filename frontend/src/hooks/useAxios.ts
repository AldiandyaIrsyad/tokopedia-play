import axios, { AxiosInstance } from 'axios';

export function useAxios(): AxiosInstance {
  const instance = axios.create({
    withCredentials: true,
  });

  return instance;
}
