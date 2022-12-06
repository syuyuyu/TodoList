import { useAuth } from 'contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todo');
    } else {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);
};

export default HomePage;
