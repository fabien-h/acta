# Acta API essentials

In Acta, you can store string, numbers, objects, and arrays. Since all values stored have to be compatible with the local storage (string ony) Maps, Sets, functions... won’t work.

There is only one global store. Since this is an indexed object, there are no performance issue. Even with big objects and many keys.

You don't need tooling to debug Acta. In your browser developper tools, `Acta.states` will let you access to all the informations you need. The store methods like `Acta.setState` or `Acta.dispatchEvent` are available in the console.

## Acta.subscribeState

`Acta.subscribeState()` must be called inside with a component reference. Usually in the `componentDidMount()` method. The component will then be explicitely subscribed to the state. Each time the state is set from anywhere in the application (even cross tabs), the callback will be triggered and pass the new value.

The simple way to call `subscribeState` is to pass a state key. When a `dispatchedState` is called, the state of the component will be set to the disptached value.

If you need a more custom behaviour, you can pass a callback that will pass the updated value as only argument.

> If you pass `this` - as the context of the current component - in a closure, you can subscrive from anywhere. But this is not recommended. As is would make code harder to read.

**Example**

```typescript
public componentDidMount(): void {
  Acta.subscribeState(
    'ACTA_KEY_TODOS_2',
    'myTodos'
    this
  );
}
```

```typescript
public componentDidMount(): void {
  Acta.subscribeState(
    'ACTA_KEY_TODOS',
    (todos) => this.setState(todos),
    this,
    defaultValue: []
  );
}
```

**Types**

```typescript
subscribeState: (
  stateKey: string,
  callbackOrStateKey: string | (valueToReturn: any) => void,
  context: IComponentWithID,
  defaultValue?: string | number | object
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
  'localStorage'
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
