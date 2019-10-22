# Acta

Super light and dead simple state manager and event dispatcher for react.

# Main API

In Acta, you can store string, numbers, objects, and arrays. Since all values stored have to be compatible with the local storage (string ony) Maps, Sets, functions... won’t work.

There is only one global store. Since this is an indexed object, there are no performance issue. Even with big objects and many keys.

## Acta.subscribeState

`Acta.subscribeState` is usually called in `componentDidMount`.

```JavaScipt
  subscribeState: (
    stateKey: string,
    callback: (valueToReturn: any) => void,
    context: IComponentWithID,
    defaultValue?: string | number | object,
  ) => TActaValue;
```

- `stateKey`: this is a `string`, you should use constants like ACTA_KEY_USER_NAME to avoid collisions and make your life easy when refactoring.
- `callback`: when the targeted state changes in **Acta**, the callback is called. The only parameter is the new value of the state. The callback will usually include a `this.setState(...)` somewhere.
- `context`: this is the subscribing component almost always `this`.
- `defaultValue`: _optionnal_ if the state was not previously set and that you need a value, use it.

The call returns the current value for the target state.

> You can call `unsubscribeState` to explicitly stop the sub. But you don’t need to do any cleanup. When a component will unmount, **Acta** will call `unsubscribeState` for the component.

example:

```JavaScript
  public componentDidMount() {
    const initialTodos = Acta.subscribeState({
      stateKey: ACTA_KEY_TODOS,
      context: this,
      callback: todos => this.setState({ todos }),
      defaultValue: [],
    });
    this.setState({ initialTodos });
  }
```

## Acta.setState

`Acta.setState` can be called from anywhere (including in your dev console).

```JavaScipt
  setState: (
    states: {
      [stateKey: string]: TActaValue;
    },
    persistenceType?: 'sessionStorage' | 'localStorage',
  ) => void;
```

- `states`: a key/values pairs object where each key is a state.
- `persistenceType`: _optionnal_ if you want the state to persist or if you want to share it with other windows/tabs, set a persistence.

## Acta.getState

`Acta.getState` can be called from anywhere (including in your dev console).

```JavaScipt
  getState: (stateKey: string) => TActaValue;
```

- `stateKey`: the state you want to retrieve.

## Acta.subscribeEvent

`Acta.subscribeEvent` is usually called in `componentDidMount`.

```JavaScipt
  subscribeEvent: (
    eventKey: string,
    callback: (valueToReturn: any) => void,
    context: IComponentWithID,
  ) => void;
```

- `eventKey`: this is a `string`, you should use constants like ACTA_KEY_USER_NAME to avoid collisions and make your life easy when refactoring.
- `callback`: when the targeted state changes in **Acta**, the callback is called. The only parameter is the new value of the state. The callback will usually include a `this.setState(...)` somewhere.
- `context`: this is the subscribing component almost always `this`.

> You can call `unsubscribeEvent` to explicitly stop the sub. But you don’t need to do any cleanup. When a component will unmount, **Acta** will call `unsubscribeEvent` for the component.

## Acta.dispatchEvent

`Acta.dispatchEvent` can be called from anywhere (including in your dev console).

```JavaScipt
  dispatchEvent: (
    eventKey: string,
    data?: TActaValue,
    isShared?: boolean,
  ) => void;
```

- `eventKey`: the key for the target event.
- `data`: _optionnal_ the data to pass.
- `isShared`: _optionnal_ if you want to share this event between windows and tabs.

# Secondary API

You can use those methods for some edge case, but you should not normally have to.

## Unsubscribe

```JavaScipt
  unsubscribeState: (stateKey: string, context: IComponentWithID) => void;

  unsubscribeEvent: (eventKey: string, context: IComponentWithID) => void;
```

If you want to explicitly unsubscribe. But Acta cleans after itself when the component will unmount.

## HasState

```JavaScipt
  hasState: (stateKey: string) => boolean;
```

You should use `getState`.

## DeleteState

```JavaScipt
  deleteState: (
    stateKey: string,
    persistenceType: 'localStorage' | 'sessionStorage',
  ) => void;
```

If you need to clean up your store.
