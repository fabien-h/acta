import { IActa } from './types';

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
    this.initialized = true;

    /**
     * Attach to the window for global public access
     */
    (window as any).Acta = Acta;

    /**
     * Load the data from local and session storage
     */
    const storage = { ...localStorage, ...sessionStorage };
    for (const storedObjectKey in storage) {
      if (storedObjectKey.slice(0, 8) === '__acta__') {
        const value = JSON.parse(storage[storedObjectKey]);
        if (value !== undefined && value !== null) {
          this.setState({
            stateKey: storedObjectKey.slice(8),
            value,
          });
        }
      }
    }

    /**
     * Listen to the storage to synchronise Acta between tabs
     */
    window.addEventListener(
      'storage',
      event => {
        if (event.key && event.key.slice(0, 8) === '__acta__') {
          if (
            event.newValue !== null &&
            event.newValue !== '' &&
            event.newValue !== 'null'
          ) {
            this.setState({
              stateKey: event.key.slice(8),
              value: JSON.parse(event.newValue),
            });
          } else {
            this.setState({
              stateKey: event.key.slice(8),
              value: null,
            });
          }
        }
      },
      false,
    );
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
  subscribeState({ stateKey, callback, context, defaultValue }) {
    /* Ensure the arguments */
    if (
      !stateKey ||
      !callback ||
      !context ||
      typeof stateKey !== 'string' ||
      typeof callback !== 'function' ||
      typeof context !== 'object'
    ) {
      throw new Error(
        'You need to provide a state key, a callback function and a context (a mounted or mounting react component) when subscribing to a state',
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
        this.unsubscribeState({
          context,
          stateKey,
        });
        oldComponentWillUnmount.bind(context)();
      };
    } else {
      context.componentWillUnmount = () =>
        this.unsubscribeState({
          context,
          stateKey,
        });
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
  unsubscribeState({ stateKey, context }) {
    /* Ensure the arguments */
    if (
      !stateKey ||
      !context ||
      typeof stateKey !== 'string' ||
      typeof context !== 'object' ||
      !this.states[stateKey]
    ) {
      throw new Error(
        'You need to provide an existing state key, and a context (a mounted or mounting react component) when unsubscribing from a state',
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
   * @param {String} stateKey - mandatory - the state to target
   * @param {*} value - optionnal - can be anything, including falsy values
   * ; if that argument is omitted, the state will become undefined
   * @param {String} persistenceType - optionnal - can be "sessionStorage" or "localStorage"
   * if set, the state will be saved into the corresponding storage
   */
  setState({ stateKey, value, persistenceType }) {
    /* Ensure the arguments */
    if (!stateKey || typeof stateKey !== 'string') {
      throw new Error('You need to provide a state key.');
    }

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

    /* If persistence is configured, store the value */
    if (persistenceType === 'localStorage') {
      window.localStorage.setItem(`__acta__${stateKey}`, JSON.stringify(value));
    } else if (persistenceType === 'sessionStorage') {
      window.sessionStorage.setItem(
        `__acta__${stateKey}`,
        JSON.stringify(value),
      );
    } else if (persistenceType) {
      throw new Error(
        'Persistence type can only be sessionStorage or localStorage.',
      );
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
          !this.states[stateKey].subscribtions[actaID] ||
          !this.states[stateKey].subscribtions[actaID].context ||
          !this.states[stateKey].subscribtions[actaID].callback
        ) {
          console.warn(
            'The context or the callback of an Acta subscribtion does not exists.',
          );
          delete this.states[stateKey].subscribtions[actaID];
        }
      }
    });
  },

  /**
   * Delete a state
   *
   * @param {String} state the state to target
   */
  deleteState({ stateKey, persistenceType }) {
    /* Ensure the arguments */
    if (!stateKey || typeof stateKey !== 'string') {
      throw new Error('You need to provide a state key.');
    }

    this.setState({ stateKey, value: null });

    if (persistenceType === 'sessionStorage') {
      window.sessionStorage.removeItem(`__acta__${stateKey}`);
    } else if (persistenceType === 'localStorage') {
      window.localStorage.removeItem(`__acta__${stateKey}`);
    } else if (persistenceType) {
      throw new Error(
        'Persistence type can only be sessionStorage or localStorage.',
      );
    }
  },

  /**
   * return the state form its name
   *
   * @param {String} stateKey - the key to identify the target state
   * @return {*} can be anything
   */
  getState(stateKey) {
    /* Ensure the arguments */
    if (!stateKey || typeof stateKey !== 'string' || !this.states[stateKey]) {
      if (process.env.APP_ENV === 'development') {
        console.warn('You need to provide an existing state key.');
      }
      return null;
    }

    return (
      this.states[stateKey].value || this.states[stateKey].defaultValue || null
    );
  },

  /**
   * check the existence of a state
   *
   * @param {String} stateKey - the key to identify the target state
   */
  hasState(stateKey) {
    return !!this.states[stateKey];
  },

  /**
   * subscribeEvent is called from a react component with a callback
   * when the corresponding event is dispatched, the callback is called
   * passing any argument set in the dispatcher
   *
   * that subsribtion can be destroyed manually and will be
   * destroyed automatically when the component unmount
   *
   * @param {String} eventName - The key to name the event
   * @param {Function} callback - Reference to the callback that will
   * be called when the state change
   * @param {React.Component} context - Reference to the react component from
   * wich the subscribtion is made => that will be needed to unsubscribe
   * when the compnent woll unmount
   */
  subscribeEvent({ eventName, callback, context }): void {
    /* Ensure the arguments */
    if (
      !eventName ||
      !callback ||
      !context ||
      typeof eventName !== 'string' ||
      typeof callback !== 'function' ||
      typeof context !== 'object'
    ) {
      throw new Error(
        'You need to provide a event key, a callback function and a context (a mounted or mounting react component) when subscribing to an event',
      );
    }

    /* If this event does not already exists, creates it */
    this.events[eventName] = this.events[eventName] || {};

    /* If the component does not have an acta id, get him one */
    this.ensureActaID(context);

    /* If this context already listen to that event already exists, stop here */
    if (this.events[eventName][context.actaID as string]) return;

    /**
     * Extend the componentWillUnmount hook on the context
     * with a event unsubscribtion, so when
     * the component unmounts, all its events subscribtions
     * will be destroyed
     */
    if (context.componentWillUnmount) {
      const oldComponentWillUnmount = context.componentWillUnmount;
      context.componentWillUnmount = () => {
        this.unsubscribeEvent({
          context,
          eventName,
        });
        oldComponentWillUnmount.bind(context)();
      };
    } else {
      context.componentWillUnmount = () => {
        this.unsubscribeEvent({
          context,
          eventName,
        });
      };
    }

    /**
     * Add the callback and the context to the event listener list
     * of the event
     */
    this.events[eventName][context.actaID as string] = {
      callback,
      context,
    };
  },

  /**
   * unsubscribeEvent will remove the target context form
   * the subscribtions of the target eve,t
   *
   * @param {String} eventName - The key to name the eventName
   * @param {Object} context - Reference to the target react component
   */
  unsubscribeEvent({ eventName, context }) {
    /* Ensure the arguments */
    if (
      !eventName ||
      !context ||
      typeof eventName !== 'string' ||
      typeof context !== 'object' ||
      !this.events[eventName]
    ) {
      throw new Error(
        'You need to provide an existing event name, and a context (a mounted or mounting react component) when unsubscribing from a state',
      );
    }

    /* Delete the subscribtion */
    delete this.events[eventName][context.actaID as string];
  },

  /**
   * Dispatch an event : check if the event exists and has subscribers
   * if it does, call the callback of each subscriber
   *
   * @param {String} eventName - the key to target the event
   * @param {TActaValue} data - the data passed with the event
   */
  dispatchEvent({ eventName, data }) {
    /* Ensure the arguments */
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('You need to provide an event name to set.');
    }

    /* The event should exist */
    if (!this.events[eventName]) {
      return console.warn(
        'You tried to dispatch an event that does not exist.',
      );
    }

    /* Call each subscriber callback */
    Object.keys(this.events[eventName]).forEach(actaID => {
      try {
        this.events[eventName][actaID].callback(data || null);
      } catch (err) {
        if (
          !this.events[eventName][actaID].context ||
          !this.events[eventName][actaID].callback
        ) {
          console.warn(
            'The context or the callback of an Acta event does not exists.',
          );
          delete this.events[eventName][actaID];
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
 * works only client side
 */
if (typeof window !== 'undefined' && !Acta.initialized) Acta.init();

export default Acta;
