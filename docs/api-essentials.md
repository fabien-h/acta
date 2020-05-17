# Acta API essentials

These are the main methods that you should use.

- `Acta.subscribeState`: subscribe to a state in a class component
- `Acta.useActaState`: subscribe to a state in a functional component
- `Acta.setState`: set the value of a state in **Acta**
- `Acta.subscribeEvent`: subscribe to an event in a class component
- `Acta.useActaEvent`: subscribe to an event in a functional component
- `Acta.dispatchEvent`: dispatch an event
- `Acta.getState`: get the value of a state in **Acta**

> In the following document, the type `TActaValue` is `string | number | object | boolean | null | undefined | Array<TActaValue> | { [key: string]: TActaValue }`.

## Acta.subscribeState

Called from a class component, usually in the `componentDidMount()` method. You always need to pass the current context with `this`.

The simple way to call `subscribeState` is to pass an **Acta** key and a local state key. When the corresponding state change in **Acta** - after a `setState` for example - the local state is updated.

**Example**

```typescript
public componentDidMount(): void {
  Acta.subscribeState('ACTA_STATE_KEY', 'local_state_key' this);
}
```

If you need a more complex behaviour, you can pass a callback instead of the local state key. The callback will receive the updated state as argument.

**Example**

```typescript
public componentDidMount(): void {
  Acta.subscribeState(
    'ACTA_STATE_KEY',
    updatedValue => handler(updatedValue),
    this,
    defaultValue: []
  );
}
```

> If you pass `this` - as the context of the current component - in a closure, you can subscrive from anywhere. But this is not recommended. As is would make the dataflow harder to understand.

**Types**

```typescript
subscribeState: (
  stateKey: string,
  callbackOrStateKey: string | (valueToReturn: any) => void,
  context: React.Component,
  defaultValue?: TActaValue
) => TActaValue;
```

- `stateKey`: this is a `string`, you should use constants like ACTA_KEY_USER_NAME to avoid collisions and make your life easy when refactoring.
- `callbackOrStateKey`: when the targeted state changes in **Acta**, the callback is called. The only parameter is the new value of the state. The callback will usually include a `this.setState(...)` somewhere.
- `context`: this is the subscribing component almost always `this`.
- `defaultValue`: _optionnal_ if the state was not previously set and that you need a value, use it.

The call returns the current value for the target state.

> You can call `unsubscribeState` to explicitly stop the sub. But you don’t need to do any cleanup. When a component will unmount, **Acta** will call `unsubscribeState` for the component.

## Acta.useActaState

Like `Acta.subscribeState` but for functional components.

**Example**

```typescript
// valueFromActa will be updated when the state change
const valueFromActa = Acta.useActaState('ACTA_STATE_KEY');
```

**Types**

```typescript
useActaState: (actaStateKey: string, defaultValue?: TActaValue) => TActaValue;
```

- `ACTA_STATE_KEY`: the state key in **Acta**.
- `defaultValue`: _optionnal_ if the state does not alreay exists in acta, you can set its value with this param.

## Acta.setState

`Acta.setState` can be called from anywhere (including your dev console). It updates the value of the selected key in **Acta** and triggers the callbacks in all subscribing components.

**Example**

```typescript
Acta.setState(
  {
    ACTA_STATE_KEY: 'value',
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
    'ACTA_EVENT_KEY',
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
  context: React.Component,
) => void;
```

- `eventKey`: this is a `string`, you should use constants like ACTA_KEY_USER_NAME to avoid collisions and make your life easy when refactoring.
- `callback`: when the targeted state changes in **Acta**, the callback is called. The only parameter is the new value of the state. The callback will usually include a `this.setState(...)` somewhere.
- `context`: this is the subscribing component almost always `this`.

> You can call `unsubscribeEvent` to explicitly stop the sub. But you don’t need to do any cleanup. When a component will unmount, **Acta** will call `unsubscribeEvent` for the component.

## Acta.useActaEvent

Like `Acta.subscribeEvent` but for functional components.

**Example**

```typescript
Acta.useActaEvent('ACTA_EVENT_KEY', handler);
```

**Types**

```typescript
useActaEvent: (
  stateKey: string,
  callback: (value?: TActaValue) => void
) => void | boolean;
```

- `ACTA_EVENT_KEY`: the event key in **Acta**.
- `handler`: the callback that is trigerred when the event is dispatched

## Acta.dispatchEvent

`Acta.dispatchEvent` is very similar to `Acta.setState()`.

**Example**

```typescript
  Acta.dispatchEvent(
    'ACTA_EVENT_KEY',
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
Acta.getState('ACTA_STATE_KEY');
```

**Types**

```typescript
getState: (stateKey: string) => TActaValue;
```

- `stateKey`: the state you want to retrieve.
