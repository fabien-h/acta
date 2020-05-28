import React from 'react';

import { FunctionalTodosList } from './components/FunctionalTodosList';
import { ClassTodoList } from './components/ClassTodoList';
import { AddTodoForm } from './components/AddTodoForm';
import { DispatchMessageForm } from './components/DispatchMessageForm';
import { FunctionalMessages } from './components/FunctionalMessages';
import { ClassMessages } from './components/ClassMessages';

import './App.scss';

export const App = () => {
  return (
    <main id='main'>
      <header>
        <h1>Acta example application</h1>
      </header>

      <div className='todoLists'>
        <FunctionalTodosList />
        <ClassTodoList />
      </div>

      <AddTodoForm />
      <DispatchMessageForm />

      <FunctionalMessages />
      <ClassMessages />
    </main>
  );
};
