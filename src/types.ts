import React from 'react';

export type TActaValue = string | number | object | boolean | null | undefined;

export interface IState {
  value: TActaValue;
  defaultValue: TActaValue;
  subscribtions: {
    [key: string]: {
      callback: (value: TActaValue) => void;
      context: IComponentWithID;
    };
  };
}

export interface IEvents {
  [key: string]: {
    callback: (value: TActaValue) => void;
    context: IComponentWithID;
  };
}

export interface IComponentWithID extends React.Component {
  actaID: string;
}

export interface IActa {
  initialized: boolean;

  states: {
    [key: string]: IState;
  };
  events: {
    [key: string]: IEvents;
  };
  actaIDs: Array<string>;

  init: () => void;
  ensureActaID: (context: IComponentWithID) => string | boolean;

  subscribeState: (
    stateKey: string,
    callback: (valueToReturn: TActaValue) => void,
    context: IComponentWithID,
    defaultValue: string | number | object,
  ) => TActaValue;
  unsubscribeState: (stateKey: string, context: IComponentWithID) => void;
  setState: (
    stateKey: string,
    value: TActaValue,
    persistenceType?: 'sessionStorage' | 'localStorage',
  ) => void;
  getState: (stateKey: string) => TActaValue;
  hasState: (stateKey: string) => boolean;

  deleteState: (
    stateKey: string,
    persistenceType: 'localStorage' | 'sessionStorage',
  ) => void;

  subscribeEvent: (
    eventName: string,
    callback: () => void,
    context: IComponentWithID,
  ) => void;
  unsubscribeEvent: (eventName: string, context: IComponentWithID) => void;
  dispatchEvent: (eventName: string, data?: TActaValue) => void;
}
