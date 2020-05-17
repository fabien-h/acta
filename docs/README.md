# Acta

Super light and dead simple state manager and event dispatcher for react.

[![badgen minzip](https://badgen.net/bundlephobia/minzip/acta)](https://bundlephobia.com/result?p=acta)
[![badgen typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
![badgen types included](https://badgen.net/npm/types/acta)
[![badgen mit licence](https://badgen.net/badge/license/MIT/blue)](https://en.wikipedia.org/wiki/MIT_License)
![codacy code quality](https://api.codacy.com/project/badge/Grade/73e7fdaa376448c2835a23c3f4749c8f)
[![badgen npm version](https://badgen.net/npm/v/acta)](https://www.npmjs.com/package/acta)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Acta is providing

- A unique global state with keys indexed values.
- A one line straight forward way of subscribing to the application state in a component `Acta.subscribeState('appStateKey', 'localStateKey');`.
- A hook for functional components `const valueFromActa = Acta.useActaState('appStateKey');` that share states with class components.
- A simple way of setting / getting the state `Acta.setState({appStateKey: value})`.
- A one line straight forward way of subscribing application events in a component `Acta.subscribeState('appEventKey', handler);`.
- A hook for functional components `Acta.useActaEvent('appEventKey', handler);` that share events. with class components.
- A simple way of dispatching an event `Acta.dispatchEvent('appEventKey', value)`.
- Optionnal Local or session storage persistence out of the box.
- Shared state between tabs and windows.
- Great performances since the store contains references to the callbacks instead of having to iterate on every reducer and stop only when it find the corresponding ones.
- Self cleaning methods to unsubscribe to states and events.
- Exposed global object that you can call from anywhere without having to setup and pass providers, wrapers or decorators.
- Easy debuging from the browser console. Juste type `Acta` and see the object and the internals.

## Why another state manager?

React ecosystem already has excellent state managers. [Redux](https://redux.js.org/) and [MobX](https://mobx.js.org/README.html) are great tools. But teams tend to make a mess of their codebase with overcomplicated state management patterns because they have seen it work for big applications and online tutorials are encouraging premature scale optimization.

Maintainability is the ability to make changes with confidence. If you cannot understand your dataflow instantly today and describe it in a simple sentence, it means that three months from now you will be lost in the layers of abstraction that you just created and that any modification will be a nightmare.

If an action calls a dispatcher to push updated data in a middleware that will look into a bunch a reducers to find the one that will transform the updated data to push them into a provider that will trigger a mapping from the tranformed updated data into properties in a higher order function that wraps the parent of the current component where the data will be displayed... Well, congratulations, you made the life of the next guy a hell. And this is not a caricature, some applications have way more complicated dataflow. Sometimes it's required; but if I bet that it's not your case, I'll be right 99.9% of the time.

The goal of acta is to make you forget about reducers, observers, maptoprops, providers, HOCs... Components are explicitely responsible for subscribing to the state or event. You can call for a complex data treatment inside the component. You can have actions that will be triggered. But the incoming data flow should be the most direcct possible.

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
