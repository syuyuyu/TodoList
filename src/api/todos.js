import axios from 'axios';

const baseURL = 'http://localhost:3001';

// get
export const getTodos = async () => {
  try {
    const res = await axios.get(`${baseURL}/todos`);
    //axios將回傳值放在data property裡
    return res.data;
  } catch (err) {
    console.error('[Get todos failed]:', err);
  }
};

// post
export const createTodo = async (payload) => {
  const { title, isDone } = payload;
  try {
    const res = await axios.post(`${baseURL}/todos`, {
      title,
      isDone,
    });
    return res.data;
  } catch (err) {
    console.error('[Create Todo failed]:', err);
  }
};

export const patchTodo = async (payload) => {
  const { id, title, isDone } = payload;
  try {
    const res = await axios.patch(`${baseURL}/todos/${id}`, {
      title,
      isDone,
    });
    return res.data;
  } catch (err) {
    console.error('[Patch Todo failed]:', err);
  }
};

export const deleteTodo = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}/todos/${id}`);
    return res.data;
  } catch (err) {
    console.error('[Delete Todo failed]', err);
  }
};
