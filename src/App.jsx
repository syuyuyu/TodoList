import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TodoPage, LoginPage, SignUpPage, HomePage } from './pages';
import './App.scss';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="Signup" element={<SignUpPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
      {/* <TodoPage /> */}
    </div>
  );
}

export default App;
