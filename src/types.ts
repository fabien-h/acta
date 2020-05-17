import React from 'react';

export type TActaValue =
  | string
  | number
  | object
  | boolean
  | null
  | undefined
  | Array<TActaValue>
  | { [key: string]: TActaValue };

export interface IState {
  value: TActaValue;
  defaultValue: TActaValue;
  subscribtions: {
    [contextID: string]: {
      callback: (value: TActaValue) => void;
      context?: IComponentWithID;
    };
  };
}

export interface IEvent {
  [contextID: string]: {
    callback: (value: TActaValue) => void;
    context?: IComponentWithID;
  };
}

export interface IComponentWithID extends React.Component {
  actaID?: string;
}

export interface IActa {
  initialized: boolean;

  states: {
    [actaStateKey: string]: IState;
  };
  events: {
    [actaEventKey: string]: IEvent;
  };
  actaIDs: Array<string>;

  init: (userProvidedWindow?: Window) => void;

  ensureActaID: (context: IComponentWithID) => boolean | string;

  subscribeState: (
    actaStateKey: string,
    callbackOrLocalStateKey: string | ((valueToReturn: any) => void),
    context: IComponentWithID,
    defaultValue?: TActaValue
  ) => void;

  useActaState: (actaStateKey: string, defaultValue?: TActaValue) => TActaValue;

  unsubscribeState: (stateKey: string, context: IComponentWithID) => void;

  setState: (
    states: {
      [stateKey: string]: TActaValue;
    },
    persistenceType?: 'sessionStorage' | 'localStorage'
  ) => void;

  getState: (stateKey: string) => TActaValue;

  hasState: (stateKey: string) => boolean;

  deleteState: (
    stateKey: string,
    persistenceType?: 'localStorage' | 'sessionStorage'
  ) => void;

  subscribeEvent: (
    eventKey: string,
    callback: (valueToReturn: any) => void,
    context: IComponentWithID
  ) => void | boolean;

  useActaEvent: (
    stateKey: string,
    callback: (value?: TActaValue) => void
  ) => void | boolean;

  unsubscribeEvent: (eventKey: string, context: IComponentWithID) => void;

  dispatchEvent: (
    eventKey: string,
    data?: TActaValue,
    isShared?: boolean
  ) => void;
}
