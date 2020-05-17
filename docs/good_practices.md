# Good practices

## What should I put in the application state?

The states that should be shared between all components or all routes or all tabs. Ask yourself a simple question: Do you want this state to persist when the user reloads the page? If not, that's probably a bad sign. Put it in the component local state, this is still a good practice.

Examples:

- ✅ The data related to the user and its logged status should persist.
- 🚫The hover state of a button should be in a temporary local state.
- ✅ The checkout funnel state for an e-commerce website should persist.
- 🚫The loading state of a view is temporary and should not affect the other parts of the application.
- ⚠️ The specific data fetched for a view could persist. It depends on you.

> You can keep the data fetched for a specific view as a way of memoize of a datacall. It will allow you to instantly display old data while the fresh ones are loading. But this is a poors man solution and you should implement this behaviour in your data layer or use a service worker.

## Managing my state and event keys

### Case conventions

Usually people go for the underscore full caps option. An acta state key would look like this: `ACTA_STATE_KEY_USER_DATA`.

### With TypeScript

The best way to manage your keys is to use a TypeScript enum.

```typescript
export enum ActaStateKey {
  USER_DATA = 'USER_DATA',
  DISPLAYED_LAYERS = 'DISPLAYED_LAYERS',
}

-------

import { ActaStateKey } from 'constants/path/to/file';

[...]
Acta.setState({ [ActaStateKey.USER_DATA]: {userName: 'John Doe'});
Acta.getState(ActaStateKey.USER_DATA);
Acta.subscribeState(ActaStateKey.USER_DATA, 'localStateKey');

```

You will enjoy your IDE tooling, refactoring will be easier and after compilation the enum will be replaced by the corresponding values.

> You should have only one enum to avoid collisions.

### Without TypeScript

You can freeze an object containing key value pairs.

```typescript
export const ActaStateKey = Object.freeze({
  USER_DATA: 'USER_DATA',
  DISPLAYED_LAYERS: 'DISPLAYED_LAYERS',
})

-------

import { ActaStateKey } from 'constants/path/to/file';

[...]
Acta.setState({ [ActaStateKey.USER_DATA]: {userName: 'John Doe'});
Acta.getState(ActaStateKey.USER_DATA);
Acta.subscribeState(ActaStateKey.USER_DATA, 'localStateKey');

```

> Remember that `Object.freeze` does not deepfreeze.
