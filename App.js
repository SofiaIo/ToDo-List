import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  // Загрузка задач из localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  // Сохранение задач в localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date().toISOString()
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  return (
    <div className="todo-app">
      <h1>To-Do List</h1>
      
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Добавить новую задачу..."
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>+</button>
      </div>

      <div className="task-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Активные
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Завершенные
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span
              className="checkbox"
              onClick={() => toggleTask(task.id)}
            >
              {task.completed && '✓'}
            </span>
            <span className="task-text">{task.text}</span>
            <button
              className="delete-btn"
              onClick={() => deleteTask(task.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {tasks.some(task => task.completed) && (
        <button className="clear-btn" onClick={clearCompleted}>
          Очистить завершенные
        </button>
      )}

      <div className="task-counter">
        Осталось задач: {tasks.filter(task => !task.completed).length}
      </div>
    </div>
  );
}

export default App;