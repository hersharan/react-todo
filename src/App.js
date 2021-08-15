import React, { useState, useEffect } from "react";
import "./App.css";

const FILTER_VALUES = [
  { key: "", value: "All" },
  { key: "PENDING", value: "Pending" },
  { key: "COMPLETED", value: "Completed" },
];

const LS_KEY = 'todo';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [inputTodo, setInputTodo] = useState("");

  const onAdd = () => {
    if (inputTodo && inputTodo !== "") {
      const newTodos = [
        ...todoList,
        {
          id: parseInt(Math.random() * (100 - 1) + 1),
          todo: inputTodo,
          status: false,
        },
      ];
      setTodoList(newTodos);
      setFilteredList(newTodos);
      localStorage.setItem(LS_KEY, JSON.stringify(newTodos));
      setInputTodo("");
    }
  };

  const onRemove = (e, data) => {
    e.stopPropagation();
    const index = todoList.findIndex((ele) => ele.id === data.id);
    if(index > -1){
      const newTodos = [...todoList];
      newTodos.splice(index, 1);
      setTodoList(newTodos);
      setFilteredList(newTodos);
      localStorage.setItem(LS_KEY, JSON.stringify(newTodos));
    }
  };

  const onComplete = (e, data) => {
    e.stopPropagation();
    const index = todoList.findIndex((ele) => ele.id === data.id);
    if (index > -1) {
      const newTodos = [...todoList];
      newTodos[index].status = !newTodos[index].status;
      setTodoList(newTodos);
      setFilteredList(newTodos);
      localStorage.setItem(LS_KEY, JSON.stringify(newTodos));
    }
  };

  const onFilterSelect = (e) => {
    const filter = e.target.value;
    setSelectedFilter(filter);
    if (filter === "") {
      return setFilteredList(todoList);
    }
    if (filter === "COMPLETED") {
      const newList = todoList.filter((item) => item.status === true);
      return setFilteredList(newList);
    }
    if (filter === "PENDING") {
      const newList = todoList.filter((item) => item.status === false);
      return setFilteredList(newList);
    }
  };

  useEffect(()=>{
    const items = JSON.parse(localStorage.getItem(LS_KEY));
    if(items && items.length > 0){
      setTodoList(items);
      setFilteredList(items);
    }
  },[])

  return (
    <div className="App">
      <header className="App-header">React Todo</header>
      <section>
        <input
          type="text"
          value={inputTodo}
          placeholder="add a task"
          onChange={(e) => setInputTodo(e.target.value)}
        />
        <button onClick={onAdd}>Add</button>
      </section>
      <hr />
      {todoList && todoList.length > 0 && (
        <section>
          filter :
          <select value={selectedFilter} onChange={(e) => onFilterSelect(e)}>
            {FILTER_VALUES.map((item) => (
              <option value={item.key} defaultValue={item.key === ""} key={item.key}>
                {item.value}
              </option>
            ))}
          </select>
        </section>
      )}
      {todoList && todoList.length > 0 && <hr />}
      <section>
        {filteredList &&
          filteredList.length > 0 &&
          filteredList.map((item) => (
            <div
              className={item.status ? "completed" : "in-progress"}
              key={item.id}
              onClick={(e) => onComplete(e,item)}
              role="presentation"
            >
              <span>{item.todo}</span>
              <span>
                <button onClick={(e) => onRemove(e, item)}>Delete</button>
              </span>
            </div>
          ))}
      </section>
    </div>
  );
}

export default App;
