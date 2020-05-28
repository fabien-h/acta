import React, { useState } from 'react';
import Acta from 'acta';
import { ACTA_EVENT_MESSAGE } from '../constants/actaKeys';
import { Message } from './Message';

interface IMessage {
  message: string;
  date: number;
}

interface IState {
  messages: Array<IMessage>;
}

export class ClassMessages extends React.Component<{}, IState> {
  public state: IState = {
    messages: [],
  };

  public componentDidMount() {
    Acta.subscribeEvent(
      ACTA_EVENT_MESSAGE,
      (message) =>
        this.setState({
          messages: [
            ...this.state.messages,
            {
              message: `Message in class component: ${message}`,
              date: new Date().getTime(),
            },
          ],
        }),
      this
    );
  }

  private removeMessage = (messageDate: number) => {
    this.setState({
      messages: this.state.messages.filter(
        (message) => message.date !== messageDate
      ),
    });
  };

  public render(): JSX.Element {
    const { messages } = this.state;

    return (
      <div className='messagesContainer class'>
        {messages.map((message) => (
          <Message
            key={message.date}
            message={message.message}
            selfClose={() => this.removeMessage(message.date)}
          />
        ))}
      </div>
    );
  }
}
