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

  subscribeState: (params: {
    callback: (valueToReturn: TActaValue) => void;
    context: IComponentWithID;
    defaultValue: string | number | object;
    stateKey: string;
  }) => TActaValue;
  unsubscribeState: (params: {
    context: IComponentWithID;
    stateKey: string;
  }) => void;
  setState: (params: {
    persistenceType?: 'sessionStorage' | 'localStorage';
    stateKey: string;
    value: TActaValue;
  }) => void;
  getState: (stateKey: string) => TActaValue;
  hasState: (stateKey: string) => boolean;
  deleteState: (params: {
    persistenceType: 'localStorage' | 'sessionStorage';
    stateKey: string;
  }) => void;

  subscribeEvent: (params: {
    callback: () => void;
    context: IComponentWithID;
    eventName: string;
  }) => void;
  unsubscribeEvent: (params: {
    context: IComponentWithID;
    eventName: string;
  }) => void;
  dispatchEvent: (params: { eventName: string; data?: TActaValue }) => void;
}
