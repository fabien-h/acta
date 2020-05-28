import React from 'react';

import { FunctionalTodosList } from './components/FunctionalTodosList';
import { ClassTodoList } from './components/ClassTodoList';
import { AddTodoForm } from './components/AddTodoForm';

export const App = () => {
  return (
    <div className='App'>
      <FunctionalTodosList />
      <ClassTodoList />

      <AddTodoForm />
    </div>
  );
};
