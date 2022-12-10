import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TodoPage, LoginPage, SignUpPage, HomePage } from './pages';
import './App.scss';
import { AuthProvider } from 'contexts/AuthContext';

// 修正入口路徑
const basename = process.env.PUBLIC_URL;

function App() {
  return (
    <div className="app">
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="Signup" element={<SignUpPage />} />
            <Route path="todo" element={<TodoPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      {/* <TodoPage /> */}
    </div>
  );
}

export default App;
