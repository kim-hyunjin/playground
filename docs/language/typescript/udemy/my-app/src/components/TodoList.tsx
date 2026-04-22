import React from "react";
import { Todo } from "../models/todo";
import "./TodoList.css";

type TodoListProps = {
    items: Todo[];
    onDeleteTodo: (id: string) => void;
};

const TodoList: React.FC<TodoListProps> = (props) => {
    return (
        <ul>
            {props.items.map((todo) => (
                <li key={todo.id}>
                    <span>{todo.text}</span>
                    <button
                        onClick={() => {
                            props.onDeleteTodo(todo.id);
                        }}
                    >
                        DELETE
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
