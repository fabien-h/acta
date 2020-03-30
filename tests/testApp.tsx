import React from 'react';
import Acta from '../src';

interface IProps {}
interface IState {
  elements: Array<string>;
}

export const addElementsInActa = () =>
  Acta.setState({
    ACTA_STATE_ELEMENTS_LIST: ['a', 'b'],
  });

export default class App extends React.Component<IProps, IState> {
  public state = {
    elements: [],
  };

  public componentDidMount() {
    Acta.subscribeState(
      'ACTA_STATE_ELEMENTS_LIST',
      elements =>
        this.setState({
          elements,
        }),
      this,
    );
  }

  public render(): JSX.Element {
    const { elements } = this.state;

    return (
      <div>
        <h1>Elements</h1>

        <ul id='listContainer'>
          {(elements || []).map((element, index) => (
            <li key={index}>{element}</li>
          ))}
        </ul>
      </div>
    );
  }
}
