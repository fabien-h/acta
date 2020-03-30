import { IActa } from './types';
import { isObject } from './isObject';

const actaStoragePrefix = '__acta__';
const actaStoragePrefixLength = actaStoragePrefix.length;
const actaEventPrefix = '__actaEvent__';
const actaEventPrefixLength = actaEventPrefix.length;
const isInDOM = typeof window !== 'undefined';

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
      event => {
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
                event.newValue,
              ),
            });
          } else {
            this.setState({
              [event.key.slice(actaStoragePrefixLength)]: null,
            });
          }
        } else if (
          event.key &&
          event.key.slice(0, actaEventPrefixLength) === actaEventPrefix
        ) {
          this.dispatchEvent(
            event.key.slice(actaEventPrefixLength),
            event.newValue ? JSON.parse(event.newValue) : event.newValue,
            false,
          );
        }
      },
      false,
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
   * subscribeState is called from a react component with a callback
   * when that state will be set, its value will be send
   * to the component by the callback
   *
   * that subsribtion can be destroyed manually and will be
   * destroyed automatically when the
   *
   * @param {String} stateKey - The key to name the state
   * @param {Function} callback - Reference to the callback that will
   * be called when the state change
   * @param {Object} context - Reference to the react component from
   * wich the subscribtion is made => that will be needed to unsubscribe
   * when the compnent will unmount
   * @param {TActaValue} defaultValue - Optionnal, set a default value for
   * the state if there is none
   */
  subscribeState(stateKey, callback, context, defaultValue) {
    /* Ensure the arguments */
    if (
      typeof stateKey !== 'string' ||
      typeof callback !== 'function' ||
      !isObject(context)
    ) {
      throw new Error(
        `Acta.subscribeState params =>
[0]: string,
[1]: function,
[2]: mounted react component`,
      );
    }

    /* If the component does not have an acta id, get him one */
    this.ensureActaID(context);

    /* If this state does not already exists, creates it */
    this.states[stateKey] = this.states[stateKey] || {
      value: defaultValue || undefined,
      defaultValue: defaultValue || undefined,
      subscribtions: {},
    };

    /**
     * If a subscribtion for this context on this state
     * already exists, stop here
     */
    if (this.states[stateKey].subscribtions[context.actaID as string])
      return false;

    /**
     * Extend the componentWillUnmount hook on the context
     * with a state unsubscribtion, so when
     * the component unmounts, all its states subscribtions
     * will be destroyed
     */
    if (context.componentWillUnmount) {
      const oldComponentWillUnmount = context.componentWillUnmount;
      context.componentWillUnmount = () => {
        this.unsubscribeState(stateKey, context);
        oldComponentWillUnmount.bind(context)();
      };
    } else {
      context.componentWillUnmount = () =>
        this.unsubscribeState(stateKey, context);
    }

    /**
     * Add the callback and the context to the subscribtion list
     * of the state
     */
    this.states[stateKey].subscribtions[context.actaID as string] = {
      callback,
      context,
    };

    /* Dispatch the initial or current value to the subscriber
		if initialize is not set to false and if there is a valid
		non circular state to dispatch */
    try {
      const valueToReturn = JSON.stringify(this.states[stateKey].value || null);
      callback(JSON.parse(valueToReturn));
      return JSON.parse(valueToReturn);
    } catch (err) {
      console.error(`Error in subscribeState for "${stateKey}":`, err);
      return false;
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
    if (
      typeof stateKey !== 'string' ||
      !isObject(context) ||
      !this.states[stateKey]
    ) {
      throw new Error(
        `Acta.unsubscribeState params =>
[0]: string,
[2]: mounted react component`,
      );
    }

    /* Delete the subscribtion */
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
            JSON.stringify(value),
          );
        } else if (persistenceType === 'sessionStorage') {
          sessionStorage.setItem(
            `${actaStoragePrefix}${stateKey}`,
            JSON.stringify(value),
          );
        } else {
          throw new Error(
            'Acta.setState params => [1]: "sessionStorage" | "localStorage".',
          );
        }
      }

      /**
       * Try to dispatch to all subscribers & kill the
       * subscribtion if the subscriber has been destroyed
       */
      Object.keys(this.states[stateKey].subscribtions || {}).forEach(actaID => {
        try {
          this.states[stateKey].subscribtions[actaID].callback(value);
        } catch (err) {
          if (
            !this.states[stateKey].subscribtions[actaID]?.context ||
            !this.states[stateKey].subscribtions[actaID].callback
          ) {
            delete this.states[stateKey].subscribtions[actaID];
          }
        }
      });
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
          'Acta.deleteState params => [1]: "sessionStorage" | "localStorage".',
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
      this.states[stateKey].value ||
      this.states[stateKey].defaultValue ||
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
    return this.states.hasOwnProperty(stateKey);
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
  subscribeEvent(eventKey, callback, context): void {
    /* Ensure the arguments */
    if (
      typeof eventKey !== 'string' ||
      typeof callback !== 'function' ||
      !isObject(context)
    ) {
      throw new Error(
        `Acta.subscribeEvent params =>
[0]: string,
[1]: function,
[2]: mounted react component`,
      );
    }

    /* If this event does not already exists, creates it */
    this.events[eventKey] = this.events[eventKey] || {};

    /* If the component does not have an acta id, get him one */
    this.ensureActaID(context);

    /* If this context already listen to that event already exists, stop here */
    if (this.events[eventKey][context.actaID as string]) return;

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
    } else {
      context.componentWillUnmount = () => {
        this.unsubscribeEvent(eventKey, context);
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
    if (
      typeof eventKey !== 'string' ||
      !isObject(context) ||
      !this.events[eventKey]
    ) {
      throw new Error(
        `Acta.subscribeEvent params =>
[0]: string,
[2]: mounted react component`,
      );
    }

    /* Delete the subscribtion */
    delete this.events[eventKey][context.actaID as string];
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
    if (typeof eventKey !== 'string' || !this.events[eventKey]) {
      throw new Error(
        'Acta.dispatchEvent params => [0]: string & must exist in Acta.events',
      );
    }

    /**
     * If this is a shared message, send it to the local storage;
     * it will come back instantly
     */
    if (isShared && isInDOM) {
      localStorage.setItem(
        `${actaEventPrefix}${eventKey}`,
        JSON.stringify(data),
      );
    }

    /**
     * Call each subscriber callback
     */
    Object.keys(this.events[eventKey]).forEach(actaID => {
      try {
        this.events[eventKey][actaID].callback(data || null);
      } catch (err) {
        if (
          !this.events[eventKey][actaID].context ||
          !this.events[eventKey][actaID].callback
        ) {
          delete this.events[eventKey][actaID];
        }
      }
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
