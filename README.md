# Acta

Super light and dead simple state manager and event dispatcher for react.

![badgen minzip](https://badgen.net/bundlephobia/minzip/acta)
![badgen typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)
![badgen types included](https://badgen.net/npm/types/acta)
![badgen mit licence](https://badgen.net/badge/license/MIT/blue)
![codacy code quality](https://api.codacy.com/project/badge/Grade/73e7fdaa376448c2835a23c3f4749c8f)
![badgen npm version](https://badgen.net/npm/v/acta)

# Acta API

In Acta, you can store string, numbers, objects, and arrays. Since all values stored have to be compatible with the local storage (string ony) Maps, Sets, functions... won’t work.

There is only one global store. Since this is an indexed object, there are no performance issue. Even with big objects and many keys.

You don't need tooling to debug Acta. In your browser developper tools, `Acta.states` will let you access to all the informations you need. The store methods like `Acta.setState` or `Acta.dispatchEvent` are available in the console.

## Acta.subscribeState

`Acta.subscribeState()` must be called inside with a component reference. Usually in the `componentDidMount()` method. The component will then be explicitely subscribed to the state. Each time the state is set from anywhere in the application (even cross tabs), the callback will be triggered and pass the new value.

> If you pass `this` - as the context of the current component - in a closure, you can subscrive from anywhere. But this is not recommended. As is would make code harder to read.

**Example**

```typescript
public componentDidMount(): void {
  Acta.subscribeState(
    stateKey: 'ACTA_KEY_TODOS',
    callback: (todos) => this.setState(todos),
    context: this,
    defaultValue: [],
  );
}
```

**Types**

```typescript
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

## Acta.setState

`Acta.setState` can be called from anywhere (including in your dev console) and will trigger the callback in all the components that have subscribed to this state.

**Example**

```typescript
Acta.setState(
  {
    ACTA_KEY_TODOS: ['todo1', 'todo2'],
  },
  'localStorage',
);
```

**Types**

```typescript
setState: (
  states: {
    [stateKey: string]: TActaValue;
  },
  persistenceType?: 'sessionStorage' | 'localStorage',
) => void;
```

- `states`: a key/values pairs object where each key is a state.
- `persistenceType`: _optionnal_ if you want the state to persist or if you want to share it with other windows/tabs, set a persistence.

## Acta.subscribeEvent

`Acta.subscribeEvent()` is very similar to `Acta.subscribeState()`. The main difference is that the event value does not persists. It is used to communicate between components like notification managers.

**Example**

```typescript
public componentDidMount(): void {
  Acta.subscribeEvent(
    'ACTA_KEY_NOTIFICATIONS_EVENT',
    callback: (notification) => alert(notification),
    context: this,
  );
}
```

**Types**

```typescript
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

`Acta.dispatchEvent` is very similar to `Acta.setState()`.

**Example**

```typescript
  Acta.dispatchEvent(
    'ACTA_KEY_NOTIFICATIONS_EVENT',
    'Download is finished.',
    true
  ) => void;
```

**Types**

```typescript
  dispatchEvent: (
    eventKey: string,
    data?: TActaValue,
    isShared?: boolean,
  ) => void;
```

- `eventKey`: the key for the target event.
- `data`: _optionnal_ the data to pass.
- `isShared`: _optionnal_ if you want to share this event between windows and tabs.

# Secondary methods

You can use those methods for some edge case, but you should not normally have to. They are mostly used internally.

## Acta.getState

`Acta.getState` can be called from anywhere (including in your dev console) to get the current value attached to a state key.

**Example**

```typescript
Acta.getState('ACTA_KEY_TODOS');
```

**Types**

```typescript
getState: (stateKey: string) => TActaValue;
```

- `stateKey`: the state you want to retrieve.

## Unsubscribe (state and event)

This will be called automatically when a component will unmount and has subscriptions to and event or a state.

**Example**

```typescript
Acta.unsubscribeState('ACTA_KEY_TODOS', this);
Acta.unsubscribeEvent('ACTA_KEY_NOTIFICATIONS_EVENT', this);
```

**Types**

```typescript
  unsubscribeState: (stateKey: string, context: IComponentWithID) => void;
  unsubscribeEvent: (eventKey: string, context: IComponentWithID) => void;
```

If you want to explicitly unsubscribe. But Acta cleans after itself when the component will unmount.

## HasState

To check if a state exists

**Example**

```typescript
Acta.hasState('ACTA_KEY_TODOS');
```

**Type**

```typescript
hasState: (stateKey: string) => boolean;
```

> Most of the time, this does not output the same thing than `Boolean(Acta.getState('ACTA_KEY_TODOS'))`. But they are not equivalent. If a state exists but has a falsy value, `hasState` will return true.

## DeleteState

If you need to clean up your store.

**Example**

```typescript
Acta.deleteState('ACTA_KEY_TODOS', 'localStorage');
```

**Type**

```typescript
deleteState: (
  stateKey: string,
  persistenceType: 'localStorage' | 'sessionStorage',
) => void;
```
