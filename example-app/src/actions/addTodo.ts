import Acta from 'acta';

import { ITodo } from '../types';
import { ACTA_STATE_TODOS } from '../constants/actaKeys';

export const addTodo = (label: string, date: number) => {
  Acta.setState(
    {
      [ACTA_STATE_TODOS]: [
        ...((Acta.getState(ACTA_STATE_TODOS) as Array<ITodo>) || []),
        { label, date },
      ],
    },
    'localStorage'
  );
};
