import axios from 'axios';

const authURL = 'https://todo-list.alphacamp.io/api/auth';

// 登入功能
export const login = async ({ username, password }) => {
  try {
    //用解構的方式直接取出axios回傳的data
    const { data } = await axios.post(`${authURL}/login`, {
      username,
      password,
    });

    const { authToken } = data;
    // console.log(data);

    //若有成功取得token，回傳success及data
    if (authToken) {
      return { success: true, ...data };
    }
    return { success: false, ...data };
  } catch (err) {
    console.error('[Login failed]:', err);
  }
};

// 註冊功能
export const register = async ({ username, email, password }) => {
  try {
    const { data } = await axios.post(`${authURL}/register`, {
      username,
      email,
      password,
    });
    const { authToken } = data;
    if (authToken) {
      return { success: true, ...data };
    }
    return { success: false, ...data };
  } catch (err) {
    console.error('[Register failed:', err);
  }
};

export const checkPermission = async (authToken) => {
  try {
    const res = await axios.get(`${authURL}/test-token`, {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    });
    return res.data.success;
  } catch (err) {
    console.error('[CheckPermission failed]:', err);
  }
};
