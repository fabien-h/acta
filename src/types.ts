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
  actaID?: string;
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

  subscribeState: (params: {
    callback: (valueToReturn: any) => void;
    context: IComponentWithID;
    defaultValue?: string | number | object;
    stateKey: string;
  }) => TActaValue;

  unsubscribeState: (params: {
    context: IComponentWithID;
    stateKey: string;
  }) => void;

  setState: (
    states: {
      [stateKey: string]: TActaValue;
    },
    persistenceType?: 'sessionStorage' | 'localStorage',
  ) => void;

  getState: (stateKey: string) => TActaValue;

  hasState: (stateKey: string) => boolean;

  deleteState: (params: {
    persistenceType: 'localStorage' | 'sessionStorage';
    stateKey: string;
  }) => void;

  subscribeEvent: (params: {
    callback: (valueToReturn: any) => void;
    context: IComponentWithID;
    eventKey: string;
  }) => void;

  unsubscribeEvent: (params: {
    context: IComponentWithID;
    eventKey: string;
  }) => void;

  dispatchEvent: (
    eventKey: string,
    data?: TActaValue,
    isShared?: boolean,
  ) => void;
}
