import React from 'react';
import Acta from 'acta';

import { deleteTodo } from '../actions/deleteTodo';
import { ACTA_STATE_TODOS } from '../constants/actaKeys';
import { ITodo } from '../types';

interface IState {
  todos: Array<ITodo>;
}

export class ClassTodoList extends React.Component<{}, IState> {
  public state: IState = {
    todos: (Acta.getState(ACTA_STATE_TODOS) as Array<ITodo>) || [],
  };

  public componentDidMount() {
    Acta.subscribeState(ACTA_STATE_TODOS, 'todos', this);
  }

  public render(): JSX.Element {
    const { todos } = this.state;

    return (
      <div>
        ClassTodoList
        {(!todos || todos.length === 0) && (
          <p>No todo yet. Add one to start!</p>
        )}
        {todos.map((todo) => (
          <div key={todo.date}>
            <span>{todo.label}</span>
            <span>{todo.date.toLocaleString()}</span>
            <button onClick={() => deleteTodo(todo.date)}>- Delete</button>
          </div>
        ))}
      </div>
    );
  }
}
