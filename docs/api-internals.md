# Acta API internals

You might need those methods for some edge cases, so they are exposed. But you should not have to

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
