import React from 'react';
import Acta from '../src';

interface IState {
  elements: Array<string>;
  message?: string;
  functionalComponentDisplayed: boolean;
  simpleValue: string;
}

export const ACTA_SIMPLE_STATE_KEY = 'ACTA_SIMPLE_STATE_KEY';
export const ACTA_STATE_ELEMENTS_LIST_WITH_CALLBACK =
  'ACTA_STATE_ELEMENTS_LIST_WITH_CALLBACK';
export const ACTA_STATE_WITH_INITIAL_VALUE = 'ACTA_STATE_WITH_INITIAL_VALUE';

export const ACTA_EVENT_KEY_MESSAGE = 'ACTA_EVENT_KEY_MESSAGE';
export const ACTA_EVENT_KEY_WITH_NULL_VALUE = 'ACTA_EVENT_KEY_WITH_NULL_VALUE';

export const ACTA_KEY_FOR_STATE_HOOK = 'ACTA_KEY_FOR_STATE_HOOK';

export const addElementsInActa = (): void =>
  Acta.setState({
    [ACTA_STATE_ELEMENTS_LIST_WITH_CALLBACK]: ['a', 'b'],
  });

export const setHookValueInActa = (): void =>
  Acta.setState({
    [ACTA_KEY_FOR_STATE_HOOK]: 'Value from updated state',
  });

export const dispatchEventInActa = (): void =>
  Acta.dispatchEvent(ACTA_EVENT_KEY_MESSAGE, 'A message from an Acta event.');

export const dispatchEventInActaWithNullValue = (): void =>
  Acta.dispatchEvent(ACTA_EVENT_KEY_WITH_NULL_VALUE);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FunctionalComponent: React.FC = (): JSX.Element => {
  const valueFromState = Acta.useActaState(ACTA_KEY_FOR_STATE_HOOK);

  let valueFromEvent = 'Not set yet';

  Acta.useActaEvent(
    'actaEventKey',
    (value) => (valueFromEvent = value as string)
  );

  return (
    <div id='functionnalComponentRoot'>
      <p id='valueFromState'>
        {valueFromState ? String(valueFromState) : 'Not set yet'}
      </p>
      <p id='valueFromEvent'>{valueFromEvent || 'Not set yet'}</p>
    </div>
  );
};

export default class App extends React.Component<unknown, IState> {
  public state: IState = {
    elements: [],
    functionalComponentDisplayed: true,
    simpleValue: 'Not Set',
  };

  public componentDidMount(): void {
    Acta.subscribeState(
      ACTA_STATE_ELEMENTS_LIST_WITH_CALLBACK,
      (elements) =>
        this.setState({
          elements,
        }),
      this
    );

    Acta.subscribeState(
      ACTA_STATE_WITH_INITIAL_VALUE,
      (): boolean => false,
      this,
      'THIS IS AN INITIAL VALUE'
    );

    Acta.subscribeState(ACTA_SIMPLE_STATE_KEY, 'simpleValue', this);

    Acta.subscribeEvent(
      ACTA_EVENT_KEY_MESSAGE,
      (message) =>
        this.setState({
          message,
        }),
      this
    );

    Acta.subscribeEvent(
      ACTA_EVENT_KEY_WITH_NULL_VALUE,
      (): boolean => false,
      this
    );
  }

  public componentWillUnmount(): boolean {
    return false;
  }

  public render(): JSX.Element {
    const { elements, message, functionalComponentDisplayed, simpleValue } =
      this.state;

    const stateWithInitialValue = Acta.getState(ACTA_STATE_WITH_INITIAL_VALUE);

    return (
      <div>
        <h1>Elements</h1>

        <ul id='listContainer'>
          {(elements || []).map((element, index) => (
            <li key={index}>{element}</li>
          ))}
        </ul>

        {message && <p id='message'>{message}</p>}

        <p id='simpleValue'>{simpleValue}</p>

        <button
          id='setSimpleValueState'
          onClick={(): void => this.setState({ simpleValue: 'Set' })}
        >
          set simple value
        </button>

        <p id='stateWithInitialValue'>
          {stateWithInitialValue ? String(stateWithInitialValue) : undefined}
        </p>

        {functionalComponentDisplayed && <FunctionalComponent />}

        <button
          id='unmountFunctionalComponent'
          onClick={(): void =>
            this.setState({ functionalComponentDisplayed: false })
          }
        >
          unmount functionnal component
        </button>
      </div>
    );
  }
}
