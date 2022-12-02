import { Footer, Header, TodoCollection, TodoInput } from 'components';
// import { router } from 'json-server';
import { useState, useEffect } from 'react';
import { getTodos, createTodo, patchTodo, deleteTodo } from 'api/todos.js';
import axios from 'axios';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);

  // 取得todos
  const getTodosAsync = async () => {
    try {
      const todos = await getTodos();
      console.log(todos);
      setTodos(
        todos.map((todo) => ({
          ...todo,
          isEdit: false,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeInput = (value) => {
    setInputValue(value);
  };

  const handleAddTodo = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      await createTodo({
        title: inputValue,
        isDone: false,
      });
      getTodosAsync();
      // setTodos((prevTodos) => {
      //   return [
      //     ...prevTodos,
      //     {
      //       title: data.title,
      //       isDone: data.isDone,
      //       id: data.id,
      //       isEdit: false,
      //     },
      //   ];
      // });
      setInputValue('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = () => {
    if (inputValue.length === 0) {
      return;
    }
    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          title: inputValue,
          isDone: false,
          id: Math.random() * 100,
        },
      ];
    });
    setInputValue('');
  };

  const handleToggleDone = async (id) => {
    //使用find找到與目標相對應的id
    const currentTodo = todos.find((todo) => todo.id === id);
    try {
      await patchTodo({
        id,
        isDone: !currentTodo.isDone,
      });
      getTodosAsync();
      // setTodos((prevTodos) => {
      //   return prevTodos.map((todo) => {
      //     if (todo.id === id) {
      //       return {
      //         ...todo,
      //         isDone: !todo.isDone,
      //       };
      //     }
      //     return todo;
      //   });
      // });
    } catch (err) {
      console.error(err);
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
      getTodosAsync();
      // setTodos((prevTodos) => {
      //   return prevTodos.map((todo) => {
      //     if (todo.id === id) {
      //       return {
      //         ...todo,
      //         title,
      //         isEdit: false,
      //       };
      //     }
      //     return todo;
      //   });
      // });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    // const newTodos = todos.filter((todo) => todo.id !== id);
    try {
      await deleteTodo(id);
      getTodosAsync();
      // setTodos(newTodos);
    } catch (err) {
      console.error('delete err ', err);
    }
  };

  // 將todos放入setTodos裡
  useEffect(() => {
    getTodosAsync();
  }, []);

  return (
    <div>
      TodoPage
      <Header />
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
