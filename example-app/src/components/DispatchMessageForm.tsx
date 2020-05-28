import React from 'react';
import Acta from 'acta';
import { ACTA_EVENT_MESSAGE } from '../constants/actaKeys';

export class DispatchMessageForm extends React.Component {
  private labelInput!: HTMLInputElement;
  private isSharedCheckbox!: HTMLInputElement;

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.labelInput.value === '') {
      return;
    }

    Acta.dispatchEvent(
      ACTA_EVENT_MESSAGE,
      this.labelInput.value,
      this.isSharedCheckbox.checked
    );
    this.labelInput.value = '';
  };

  public render(): JSX.Element {
    return (
      <form onSubmit={this.onSubmit}>
        <h3>Dispatch a message</h3>

        <input
          type='text'
          placeholder='Message to dispatch'
          ref={(input) => (this.labelInput = input as HTMLInputElement)}
        />

        <p>
          The message is shared between tabs
          <input
            type='checkbox'
            ref={(input) => (this.isSharedCheckbox = input as HTMLInputElement)}
            defaultChecked={false}
          />
        </p>

        <input type='submit' value='Dispatch a message' />
      </form>
    );
  }
}
