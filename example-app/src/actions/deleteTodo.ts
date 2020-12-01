import Acta from 'acta';
import { ITodo } from '../types';
import { ACTA_STATE_TODOS } from '../constants/actaKeys';

export const deleteTodo = (date: number) => {
  Acta.setState(
    {
      [ACTA_STATE_TODOS]: (
        (Acta.getState(ACTA_STATE_TODOS) as Array<ITodo>) || []
      ).filter((todo: ITodo) => todo.date !== date),
    },
    'localStorage'
  );
};
