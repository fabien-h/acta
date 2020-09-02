import React from 'react';
import { IActa, TActaValue } from './types';
import { isObject } from './isObject';

const actaStoragePrefix = '__acta__';
const actaStoragePrefixLength = actaStoragePrefix.length;
const actaEventPrefix = '__actaEvent__';
const actaEventPrefixLength = actaEventPrefix.length;
const isInDOM = typeof window !== 'undefined';
let tempStateHooksId = 0;
let tempEventHooksId = 0;

const Acta: IActa = {
  /**
   * Boolean to know if acta has been initialized before
   */
  initialized: false,

  /**
   * states will hold values, subscribers list and history indexed by keys
   * events will hold subscribers list indexed by events keys
   * actions will hold actions function indexed by actions keys
   * actaIDs will be an array of unique ids
   */
  actaIDs: [],
  events: {},
  states: {},

  /**
   * The init function will search for any previousely acta states in the local
   * and session storage and will start listening on the changes in the storages
   * to update itself if the storage is updated from another tab
   */
  init(): void {
    /**
     * Acta is now initialized
     */
    this.initialized = true;

    /**
     * Attach to the window for global public access
     */
    (window as any).Acta = Acta;

    /**
     * Listen to the storage to synchronise Acta between tabs
     */
    window.addEventListener(
      'storage',
      (event) => {
        if (
          event.key &&
          event.key.slice(0, actaStoragePrefixLength) === actaStoragePrefix
        ) {
          if (
            event.newValue !== null &&
            event.newValue !== '' &&
            event.newValue !== 'null'
          ) {
            this.setState({
              [event.key.slice(actaStoragePrefixLength)]: JSON.parse(
                event.newValue
              ),
            });
          } else {
            this.setState({
              [event.key.slice(actaStoragePrefixLength)]: null,
            });
          }
        } else if (
          event.newValue !== null &&
          event.key?.slice(0, actaEventPrefixLength) === actaEventPrefix
        ) {
          this.dispatchEvent(
            event.key.slice(actaEventPrefixLength),
            event.newValue ? JSON.parse(event.newValue) : event.newValue,
            false
          );
          localStorage.removeItem(event.key);
        }
      },
      false
    );

    /**
     * Load the data from local and session storage
     */
    const storage = {
      ...localStorage,
      ...sessionStorage,
    };
    const storageKeys = Object.keys(storage);
    for (const storageKey of storageKeys) {
      if (storageKey.slice(0, actaStoragePrefixLength) === actaStoragePrefix) {
        const value = JSON.parse(storage[storageKey]);
        if (value !== undefined && value !== null) {
          this.setState({
            [storageKey.slice(actaStoragePrefixLength)]: value,
          });
        }
      }
    }
  },

  /**
   * This method will subscribe a react functionnal component to
   * an Acta state.
   *
   * @param { String } actaStateKey - the state key
   * @param { TActaValue } defaultValue - optionnal - the initial value
   * if not set, the initial value will be undefined
   */
  useActaState(actaStateKey: string, defaultValue?: TActaValue) {
    /* Ensure the arguments */
    if (actaStateKey === '' || typeof actaStateKey !== 'string') {
      throw new Error(
        `Acta.useActaState params =>
[0]: string,
[1]: optionnal, string | number | object | boolean | null | undefined`
      );
    }

    /* Update the interal id for future reference */
    const internalID = tempStateHooksId++;

    /**
     * Try to get an initial value in Acta if the state already exists
     * of in the optional defaultValue
     */
    const initialValue = this.hasState(actaStateKey)
      ? this.getState(actaStateKey)
      : defaultValue;

    /**
     * Init the state hook that wll return the value and
     * trigger a re-render for the component
     */
    const [actaValue, setActaValue] = React.useState(initialValue);

    /* If this state does not already exists, creates it */
    this.states[actaStateKey] = this.states[actaStateKey] || {
      value: defaultValue,
      defaultValue: defaultValue,
      subscribtions: {},
    };

    /**
     * Add the life cycle hook to subscribe to the state when
     * the component is rendered and unsubscribe when the component
     * is unmounted
     */
    React.useEffect(
      () => {
        /* Subscribe to the acta state */
        this.states[actaStateKey].subscribtions[`__${internalID}`] = {
          callback: (value) => setActaValue(value),
        };

        /* Unsubscribe when the component will unmount */
        return () => {
          delete this.states[actaStateKey].subscribtions[`__${internalID}`];
        };
      },
      /* This empty array makes that the return triggers only on the final unmount */
      []
    );

    /* Returns the initial value for immediate use */
    return actaValue;
  },

  /**
   * subscribeState is called from a react component with a callback
   * when that state will be set, its value will be send
   * to the component by the callback
   *
   * that subsribtion can be destroyed manually and will be
   * destroyed automatically when the
   *
   * @param {String} actaStateKey - The key to name the state
   * @param {Function | String} callbackOrLocalStateKey - Reference to the callback
   * that will be called when the state change or to the state key to set
   * @param {Object} context - Reference to the react component from
   * wich the subscribtion is made => that will be needed to unsubscribe
   * when the compnent will unmount
   * @param {TActaValue} defaultValue - Optionnal, set a default value for
   * the state if there is none
   */
  subscribeState(
    actaStateKey,
    callbackOrLocalStateKey,
    context,
    defaultValue = undefined
  ) {
    /* Ensure the arguments */
    if (
      actaStateKey === '' ||
      typeof actaStateKey !== 'string' ||
      (typeof callbackOrLocalStateKey !== 'function' &&
        typeof callbackOrLocalStateKey !== 'string') ||
      !isObject(context)
    ) {
      throw new Error(
        `Acta.subscribeState params =>
[0]: string,
[1]: function or string,
[2]: mounted react component`
      );
    }

    /* If the component does not have an acta id, get him one */
    this.ensureActaID(context);

    /* If this state does not already exists, creates it */
    this.states[actaStateKey] = this.states[actaStateKey] || {
      value: defaultValue,
      defaultValue: defaultValue,
      subscribtions: {},
    };

    /**
     * If a subscribtion for this context on this state
     * already exists, stop here
     */
    if (this.states[actaStateKey].subscribtions[context.actaID as string]) {
      return;
    }

    /**
     * Extend the componentWillUnmount hook on the context
     * with a state unsubscribtion, so when
     * the component unmounts, all its states subscribtions
     * will be destroyed
     */
    if (context.componentWillUnmount) {
      const oldComponentWillUnmount = context.componentWillUnmount;
      context.componentWillUnmount = () => {
        this.unsubscribeState(actaStateKey, context);
        oldComponentWillUnmount.bind(context)();
      };
    }

    /**
     * If the callback is not a function, it sets the state
     * in the component
     */
    let passedCallback;
    if (typeof callbackOrLocalStateKey === 'string') {
      passedCallback = (value: TActaValue) =>
        context.setState({
          [callbackOrLocalStateKey]: value,
        });
    } else {
      passedCallback = callbackOrLocalStateKey;
    }

    /**
     * Add the callback and the context to the subscribtion list
     * of the state
     */
    this.states[actaStateKey].subscribtions[context.actaID as string] = {
      callback: passedCallback,
      context,
    };

    /* Dispatch the initial or current value to the subscriber
		if initialize is not set to false and if there is a valid
		non circular state to dispatch */
    try {
      if (this.states[actaStateKey].value !== undefined) {
        passedCallback(
          JSON.parse(JSON.stringify(this.states[actaStateKey].value))
        );
      }
    } catch (err) {
      console.error(`Error in subscribeState for "${actaStateKey}":`, err);
    }
  },

  /**
   * unsubscribeState will simply remove the target context form
   * the subscribtions of the target state
   *
   * @param {String} stateKey - The key to name the state
   * @param {Object} context - Reference to the target react component
   */
  unsubscribeState(stateKey, context) {
    /* Ensure the arguments */
    if (typeof stateKey !== 'string' || !isObject(context)) {
      throw new Error(
        `Acta.unsubscribeState params =>
[0]: string,
[2]: mounted react component`
      );
    }

    /* Delete the subscribtion */
    if (this.states[stateKey])
      delete this.states[stateKey].subscribtions[context.actaID as string];
  },

  /**
   * set state will save the value in the the tagret state
   * and will dispatch that update to all the subscriber
   * by he provided callback
   *
   * @param {Object} states - mandatory - an object where the keys are states to set and
   * values the target values
   * @param {String} persistenceType - optionnal - can be "sessionStorage" or "localStorage"
   * if set, the state will be saved into the corresponding storage
   */
  setState(states, persistenceType) {
    /* Ensure the arguments */
    if (!isObject(states) || Object.keys(states).length === 0) {
      throw new Error('Acta.setState params => [0]: object with 1+ key');
    }

    /**
     * Loop over the states
     */
    for (const state of Object.entries(states)) {
      const stateKey = state[0];
      const value = state[1];

      /* If this state does not already exists, creates it */
      if (!this.states[stateKey]) {
        this.states[stateKey] = this.states[stateKey] || {
          value: value || undefined,
          defaultValue: undefined,
          subscribtions: {},
        };
      }

      /* Save the value */
      this.states[stateKey].value = value;

      /* If persistence is configured and we have a window, store the value */
      if (isInDOM && persistenceType) {
        if (persistenceType === 'localStorage') {
          localStorage.setItem(
            `${actaStoragePrefix}${stateKey}`,
            JSON.stringify(value)
          );
        } else if (persistenceType === 'sessionStorage') {
          sessionStorage.setItem(
            `${actaStoragePrefix}${stateKey}`,
            JSON.stringify(value)
          );
        } else {
          throw new Error(
            'Acta.setState params => [1]: "sessionStorage" | "localStorage".'
          );
        }
      }

      /**
       * Try to dispatch to all subscribers & kill the
       * subscribtion if the subscriber has been destroyed
       */
      if (this.states[stateKey].subscribtions) {
        Object.keys(this.states[stateKey].subscribtions).forEach((actaID) => {
          try {
            this.states[stateKey].subscribtions[actaID].callback(value);
            // eslint-disable-next-line no-empty
          } catch (err) {}
        });
      }
    }
  },

  /**
   * Delete a state
   *
   * @param {String} state the state to target
   */
  deleteState(stateKey, persistenceType) {
    /* Ensure the arguments */
    if (typeof stateKey !== 'string' || stateKey === '') {
      throw new Error('Acta.deleteState params => [0]: string');
    }

    delete this.states[stateKey];

    /**
     * If the persistance type is set and we have a window, remove the
     * value from the storage
     */
    if (isInDOM && persistenceType) {
      if (persistenceType === 'sessionStorage') {
        sessionStorage.removeItem(`${actaStoragePrefix}${stateKey}`);
      } else if (persistenceType === 'localStorage') {
        localStorage.removeItem(`${actaStoragePrefix}${stateKey}`);
      } else {
        throw new Error(
          'Acta.deleteState params => [1]: "sessionStorage" | "localStorage".'
        );
      }
    }
  },

  /**
   * return the state form its name
   *
   * @param {String} stateKey - the key to identify the target state
   * @return {*} can be anything
   */
  getState(stateKey) {
    /* Check the parameter */
    if (typeof stateKey !== 'string') {
      throw new Error('Acta.deleteState params => [0]: string');
    }

    return (
      this.states[stateKey]?.value ||
      this.states[stateKey]?.defaultValue ||
      undefined
    );
  },

  /**
   * check the existence of a state
   *
   * @param {String} stateKey - the key to identify the target state
   */
  hasState(stateKey) {
    /**
     * Check param
     */
    if (typeof stateKey !== 'string') {
      throw new Error('Acta.hasState params => [0]: string');
    }
    // eslint-disable-next-line no-prototype-builtins
    return this.states.hasOwnProperty(stateKey);
  },

  /**
   * Creates an event hook. A functional component can subscribe to
   * and event. The functionnal passes a callback and when the
   * event is dispatched from anywhere in the application,
   * the callback is triggered.
   *
   * @param { String } eventKey - the event key
   * @param { Function } callback - the callback after the event is dispatched
   */
  useActaEvent(eventKey, callback) {
    /* Ensure the arguments */
    if (
      eventKey === '' ||
      typeof eventKey !== 'string' ||
      typeof callback !== 'function'
    ) {
      throw new Error(
        `Acta.useActaEvent params =>
[0]: string,
[1]: function`
      );
    }

    /* Update the interal id for future reference */
    const internalID = tempEventHooksId++;

    /* If this state does not already exists, creates it */
    this.events[eventKey] = this.events[eventKey] || {};

    /**
     * Add the life cycle hook to subscribe to the state when
     * the component is rendered and unsubscribe when the component
     * is unmounted
     */
    React.useEffect(
      () => {
        /* Subscribe to the event */
        this.events[eventKey][`__${internalID}`] = {
          callback,
        };

        /* Unsubscribe */
        return () => {
          delete this.events[eventKey][`__${internalID}`];
        };
      },
      /* This empty array makes that the return triggers only on the final unmount */
      []
    );
  },

  /**
   * subscribeEvent is called from a react component with a callback
   * when the corresponding event is dispatched, the callback is called
   * passing any argument set in the dispatcher
   *
   * that subsribtion can be destroyed manually and will be
   * destroyed automatically when the component unmount
   *
   * @param {String} eventKey - The key to name the event
   * @param {Function} callback - Reference to the callback that will
   * be called when the state change
   * @param {React.Component} context - Reference to the react component from
   * wich the subscribtion is made => that will be needed to unsubscribe
   * when the compnent woll unmount
   */
  subscribeEvent(eventKey, callback, context) {
    /* Ensure the arguments */
    if (
      eventKey === '' ||
      typeof eventKey !== 'string' ||
      typeof callback !== 'function' ||
      !isObject(context)
    ) {
      throw new Error(
        `Acta.subscribeEvent params =>
[0]: string,
[1]: function,
[2]: mounted react component`
      );
    }

    /* If this event does not already exists, creates it */
    this.events[eventKey] = this.events[eventKey] || {};

    /* If the component does not have an acta id, get him one */
    this.ensureActaID(context);

    /* If this context already listen to that event already exists, stop here */
    if (this.events[eventKey][context.actaID as string]) {
      return false;
    }

    /**
     * Extend the componentWillUnmount hook on the context
     * with a event unsubscribtion, so when
     * the component unmounts, all its events subscribtions
     * will be destroyed
     */
    if (context.componentWillUnmount) {
      const oldComponentWillUnmount = context.componentWillUnmount;
      context.componentWillUnmount = () => {
        this.unsubscribeEvent(eventKey, context);
        oldComponentWillUnmount.bind(context)();
      };
    }

    /**
     * Add the callback and the context to the event listener list
     * of the event
     */
    this.events[eventKey][context.actaID as string] = {
      callback,
      context,
    };
    return;
  },

  /**
   * unsubscribeEvent will remove the target context form
   * the subscribtions of the target eve,t
   *
   * @param {String} eventKey - The key to name the eventKey
   * @param {Object} context - Reference to the target react component
   */
  unsubscribeEvent(eventKey, context) {
    /* Ensure the arguments */
    if (typeof eventKey !== 'string' || !isObject(context)) {
      throw new Error(
        `Acta.subscribeEvent params =>
[0]: string,
[2]: mounted react component`
      );
    }

    /* Delete the subscribtion */
    if (this.events[eventKey])
      delete this.events[eventKey][String(context.actaID)];
  },

  /**
   * Dispatch an event : check if the event exists and has subscribers
   * if it does, call the callback of each subscriber
   *
   * @param {String} eventKey - the key to target the event
   * @param {TActaValue} data - the data passed with the event
   * @param {Boolean} isShared - if the event should be shared accross tabs and windows
   */
  dispatchEvent(eventKey, data, isShared) {
    /* Ensure the arguments */
    if (typeof eventKey !== 'string') {
      throw new Error(
        'Acta.dispatchEvent params => [0]: string & must exist in Acta.events'
      );
    }

    /**
     * If this is a shared message, send it to the local storage;
     * it will come back instantly
     */
    if (isShared && isInDOM) {
      localStorage.setItem(actaEventPrefix + eventKey, JSON.stringify(data));
    }

    /**
     * Call each subscriber callback
     */
    Object.keys(this.events[eventKey] || {}).forEach((actaID) => {
      try {
        this.events[eventKey][actaID].callback(data || null);
        // eslint-disable-next-line no-empty
      } catch (err) {}
    });
  },

  /**
   * ensureActaID is a small utility function to
   * inject a unique id to all subscribers contexts
   */
  ensureActaID(context) {
    /* Stops there if there is already an ID */
    if (!context || context.actaID) return false;

    /* Insert a new ID in the list and inject it int the context */
    const newId = `_${this.actaIDs.length}`;
    this.actaIDs.unshift(newId);
    context.actaID = newId;
    return newId;
  },
};

/**
 * If Acta has not been initialized, init Acta
 */
if (!Acta.initialized && isInDOM) Acta.init();

export default Acta;
