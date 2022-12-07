import { Footer, Header, TodoCollection, TodoInput } from 'components';
// import { router } from 'json-server';
import { useState, useEffect } from 'react';
import { getTodos, createTodo, patchTodo, deleteTodo } from 'api/todos.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, currentMember } = useAuth();

  // 將串接api取得todos拉到外面獨立
  // const getTodosAsync = async () => {
  //   try {
  //     const todos = await getTodos();
  //     setTodos(
  //       todos.map((todo) => ({
  //         ...todo,
  //         isEdit: false,
  //       })),
  //     );
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleChangeInput = (value) => {
    setInputValue(value);
  };

  // 新增todo
  const handleAddTodo = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      // getTodosAsync();
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            title: data.title,
            isDone: data.isDone,
            id: data.id,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (err) {
      console.error('handleaddtodo err :', err);
    }
  };

  // 按下enter新增todo
  const handleKeyDown = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      // getTodosAsync();
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            title: data.title,
            isDone: data.isDone,
            id: data.id,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (err) {
      console.error('keydown err:', err);
    }
  };

  const handleToggleDone = async (id) => {
    //使用find找到與目標相對應的id
    const currentTodo = todos.find((todo) => todo.id === id);
    try {
      await patchTodo({
        id,
        isDone: !currentTodo.isDone,
      });
      // getTodosAsync();
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              isDone: !todo.isDone,
            };
          }
          return todo;
        });
      });
    } catch (err) {
      console.error('hendletoggleDome err:', err);
    }
  };

  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }
        return {
          ...todo,
          isEdit: false,
        };
      });
    });
  };

  const handleSave = async ({ id, title }) => {
    try {
      //patchTodo會回傳res.data
      await patchTodo({
        id,
        title,
      });
      // getTodosAsync();
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
              isEdit: false,
            };
          }
          return todo;
        });
      });
    } catch (err) {
      console.error('save err: ', err);
    }
  };

  const handleDelete = async (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    try {
      await deleteTodo(id);
      // getTodosAsync();
      setTodos(newTodos);
    } catch (err) {
      console.error('delete err ', err);
    }
  };

  // 將todos放入setTodos裡，使用空[]，只在開始執行一次
  useEffect(() => {
    // getTodosAsync();
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();
        setTodos(
          todos.map((todo) => ({
            ...todo,
            isEdit: false,
          })),
        );
      } catch (err) {
        console.log('usrEffect error:', err);
      }
    };
    getTodosAsync();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return (
    <div>
      TodoPage
      <Header username={currentMember?.name} />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChangeInput}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer count={todos.length} />
    </div>
  );
};

export default TodoPage;
