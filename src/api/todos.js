import axios from 'axios';
// 將串接api改為AC提供的API
const baseUrl = 'https://todo-list.alphacamp.io/api';

// 使用axios Interceptors 在發送request請求前先執行
// Set config defaults when creating the instance
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    console.error(error);
  },
);

// get
export const getTodos = async () => {
  try {
    const res = await axiosInstance.get(`${baseUrl}/todos`);
    //axios將回傳值放在data property裡
    return res.data.data;
  } catch (err) {
    console.error('[Get todos failed]:', err);
  }
};

// post
export const createTodo = async (payload) => {
  const { title, isDone } = payload;
  try {
    const res = await axiosInstance.post(`${baseUrl}/todos`, {
      title,
      isDone,
    });
    return res.data.data;
  } catch (err) {
    console.error('[Create Todo failed]:', err);
  }
};

export const patchTodo = async (payload) => {
  const { id, title, isDone } = payload;
  try {
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    });
    return res.data.data;
  } catch (err) {
    console.error('[Patch Todo failed]:', err);
  }
};

export const deleteTodo = async (id) => {
  try {
    const res = await axiosInstance.delete(`${baseUrl}/todos/${id}`);
    return res.data.data;
  } catch (err) {
    console.error('[Delete Todo failed]', err);
  }
};
