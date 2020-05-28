import React, { useState } from 'react';
import Acta from 'acta';
import { ACTA_EVENT_MESSAGE } from '../constants/actaKeys';
import { Message } from './Message';

interface IMessage {
  message: string;
  date: number;
}

let messages: Array<IMessage> = [];

export const FunctionalMessages = () => {
  const [internalMessages, setInternalMessages] = useState<Array<IMessage>>([]);

  Acta.useActaEvent(ACTA_EVENT_MESSAGE, (message) => {
    messages.push({
      message: `Message in functional component: ${message}`,
      date: new Date().getTime(),
    });
    setInternalMessages([...messages]);
  });

  const removeMessage = (messageDate: number) => {
    messages = messages.filter((message) => message.date !== messageDate);
    setInternalMessages([...messages]);
  };

  return (
    <div className='messagesContainer functional'>
      {internalMessages.map((message) => (
        <Message
          key={message.date}
          message={message.message}
          selfClose={() => removeMessage(message.date)}
        />
      ))}
    </div>
  );
};
