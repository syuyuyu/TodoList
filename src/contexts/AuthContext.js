import { login, register, checkPermission } from 'api/auth';
import { createContext, useEffect, useContext, useState } from 'react';
import * as jwt from 'jsonwebtoken';
import { useLocation } from 'react-router-dom';

const defaultAuthContext = {
  isAuthenticated: false, //判斷使用者token是否通行
  currentMember: null, // 判斷目前使用者身分(帳號)
  register: null, // register,login,logout是會影響到isAuthenticated的props
  login: null,
  logout: null,
};

const AuthContext = createContext(defaultAuthContext);
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); //通行變數
  const [payload, setPayload] = useState(null); //currentMember用到的props

  // 判斷是否登入
  // 監聽Path location的name
  const { pathname } = useLocation();

  useEffect(() => {
    const checkTokenIsValid = async () => {
      // 確認localStorage是否有authToken這個token
      const authToken = localStorage.getItem('authToken');
      // 若沒有autoToken將isAuthenticated & payload狀態改為false, null
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      // 若取得authToken，使用checkPremission取得authToken的通行資格
      const result = await checkPermission(authToken);
      // 若result為true
      if (result) {
        // 建立tempPayload變數，使用JWT將token解析取得payload
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
        setIsAuthenticated(true);

        // 若result不是true，則相反
      } else {
        setPayload(null);
        setIsAuthenticated(false);
      }
    };

    checkTokenIsValid();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload,
        //註冊API
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          // 取得token後開一個變數tempPayload用JWT token將使用者資料解析出來
          const tempPayload = jwt.decode(authToken);
          // 若tempPayload is true
          if (tempPayload) {
            // 將tempPayload放入setPayload裡
            setPayload(tempPayload);
            // 將通行變數狀態改為true
            setIsAuthenticated(true);
            // 將token儲存localStorage
            localStorage.setItem('authToken', authToken);

            // 若tempPayload is false
          } else {
            // Payload狀態改為null
            setPayload(null);
            // 通行變數狀態也改為false
            setIsAuthenticated(false);
          }
          return success;
        },
        // 登入API
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          // 取得token後開一個變數tempPayload用JWT token將使用者資料解析出來
          const tempPayload = jwt.decode(authToken);
          // 若tempPayload is true
          if (tempPayload) {
            // 將tempPayload放入setPayload裡
            setPayload(tempPayload);
            // 將通行變數狀態改為true
            setIsAuthenticated(true);
            // 將token儲存localStorage
            localStorage.setItem('authToken', authToken);

            // 若tempPayload is false
          } else {
            // Payload狀態改為null
            setPayload(null);
            // 通行變數狀態也改為false
            setIsAuthenticated(false);
          }
          return success;
        },
        // 登出
        logout: () => {
          // 用removeItem移除authToken
          localStorage.removeItem('authToken');
          // 將另外兩個狀態改為null and false
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
