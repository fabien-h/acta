import React from 'react';
import Acta from '../src';

interface IProps {}
interface IState {
  elements: Array<string>;
  message?: string;
}

export const ACTA_STATE_ELEMENTS_LIST = 'ACTA_STATE_ELEMENTS_LIST';
export const ACTA_EVENT_KEY_MESSAGE = 'ACTA_EVENT_KEY_MESSAGE';

export const addElementsInActa = () =>
  Acta.setState({
    [ACTA_STATE_ELEMENTS_LIST]: ['a', 'b'],
  });

export const dispatchEventInActa = () =>
  Acta.dispatchEvent(ACTA_EVENT_KEY_MESSAGE, 'A message from an Acta event.');

export default class App extends React.Component<IProps, IState> {
  public state: IState = {
    elements: [],
  };

  public componentDidMount() {
    Acta.subscribeState(
      ACTA_STATE_ELEMENTS_LIST,
      elements =>
        this.setState({
          elements,
        }),
      this,
    );

    Acta.subscribeEvent(
      ACTA_EVENT_KEY_MESSAGE,
      message =>
        this.setState({
          message,
        }),
      this,
    );
  }

  public render(): JSX.Element {
    const { elements, message } = this.state;

    return (
      <div>
        <h1>Elements</h1>

        <ul id='listContainer'>
          {(elements || []).map((element, index) => (
            <li key={index}>{element}</li>
          ))}
        </ul>

        {message && <p id='message'>{message}</p>}
      </div>
    );
  }
}
