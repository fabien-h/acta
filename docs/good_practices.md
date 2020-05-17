# Good practices

## What do I put in the state?

Local state is still great. Acta is there to manage the application state. The things that should be shared between all components, all routes, all tabs. And that you should get back when you are reloading the page.

- ✅ The user data
- 🚫The hover state of a button
- ✅ The form state when the user is chekcing out in a emcommerce website
- 🚫The loading state of a view
- ⚠️ The specific data for a view

> You can keep the data specific a view as a kind of memoization of a datacall. It will allow you to instantly display old data and to display the fresh ones when they finish loading. But this is a poors man solution. You should implement that in your data layer and use a service worker.

## Managing my state and event keys

### With TypeScript

The best way to manage your keys is to use a TypeScript enum.

```typescript
export enum ActaStateKey {
  USER_DATA = 'USER_DATA',
  DISPLAYED_LAYERS = 'DISPLAYED_LAYERS',
}

-------

import { ActaStateKey } from 'constants/path/to/file';

...
Acta.setState({ [ActaStateKey.USER_DATA]: {userName: 'John Doe'});
Acta.getState(ActaStateKey.USER_DATA);
Acta.subscribeState(ActaStateKey.USER_DATA, 'localStateKey');
...

```

You will enjoy your IDE tooling, refactoring will be easy and after compilation the enum will be replaced by the corresponding values.

> You should have only one enum to avoid collisions.

### Without TypeScript
