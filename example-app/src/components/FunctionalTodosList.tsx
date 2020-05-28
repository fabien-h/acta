import React from 'react';
import Acta from 'acta';

import { deleteTodo } from '../actions/deleteTodo';
import { ACTA_STATE_TODOS } from '../constants/actaKeys';
import { ITodo } from '../types';

export const FunctionalTodosList = () => {
  const todos: Array<ITodo> = Acta.useActaState(ACTA_STATE_TODOS, []) as Array<
    ITodo
  >;

  return (
    <div>
      FunctionalTodosList
      {(!todos || todos.length === 0) && <p>No todo yet. Add one to start!</p>}
      {todos.map((todo) => (
        <div key={todo.date}>
          <span>{todo.label}</span>
          <span>{todo.date.toLocaleString()}</span>
          <button onClick={() => deleteTodo(todo.date)}>- Delete</button>
        </div>
      ))}
    </div>
  );
};
