# Acta API internals

You might need those methods for some edge cases, so they are exposed. But you should not have to.

- `Acta.unsubscribeState`:
- `Acta.unsubscribeEvent`:
- `Acta.hasState`:
- `Acta.deleteState`:

## Acta.unsubscribeState // Acta.unsubscribeEvent

Kills the component subscription to a state or an event. This method will be called automatically when a component unmounts.

**Example**

```typescript
Acta.unsubscribeState('ACTA_STATE_KEY', this);
Acta.unsubscribeEvent('ACTA_EVENT_KEY', this);
```

**Types**

```typescript
unsubscribeState: (stateKey: string, context: React.Component) => void;
unsubscribeEvent: (eventKey: string, context: React.Component) => void;
```

## Acta.hasState

To check if a state exists, return true if it does, false if it does not.

Most of the time `Boolean(Acta.getState('ACTA_STATE_KEY'))` return the same value. But they are not equivalent. If a state exists but its value is `false`, `null`, `0` or `undefined`, `hasState` returns true.

**Example**

```typescript
Acta.hasState('ACTA_STATE_KEY');
```

**Type**

```typescript
hasState: (stateKey: string) => boolean;
```

## Acta.deleteState

When you need to clean up your store. It makes sense when the user logs out and you want to delete all the keys in the local storage. But you can also set them all to `''`.

**Example**

```typescript
Acta.deleteState('ACTA_STATE_KEY', 'localStorage');
```

**Type**

```typescript
deleteState: (
  stateKey: string,
  persistenceType: 'localStorage' | 'sessionStorage',
) => void;
```
