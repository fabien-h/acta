import React from 'react';

import { addTodo } from '../actions/addTodo';

export class AddTodoForm extends React.Component {
  private labelInput!: HTMLInputElement;

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.labelInput.value === '') {
      return;
    }

    addTodo(this.labelInput.value, new Date().getTime());
    this.labelInput.value = '';
  };

  public render(): JSX.Element {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          type='text'
          placeholder='todo label'
          ref={(input) => (this.labelInput = input as HTMLInputElement)}
        />
        <input type='submit' value='+ Add todo' />
      </form>
    );
  }
}
