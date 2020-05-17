# Acta

Super light and dead simple state manager and event dispatcher for react.

[![badgen minzip](https://badgen.net/bundlephobia/minzip/acta)](https://bundlephobia.com/result?p=acta)
[![badgen typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[!badgen types included](https://badgen.net/npm/types/acta)
[![badgen mit licence](https://badgen.net/badge/license/MIT/blue)](https://en.wikipedia.org/wiki/MIT_License)
[!codacy code quality](https://api.codacy.com/project/badge/Grade/73e7fdaa376448c2835a23c3f4749c8f)
[![badgen npm version](https://badgen.net/npm/v/acta)](https://www.npmjs.com/package/acta)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Acta is providing:

- A one line straight forward way of subscribing to the application state in a component `Acta.subscribeState('appStateKey', 'localStateKey');`.
- A hook for functional components `const valueFromActa = Acta.useActaState('appStateKey');`
- A simple way of setting / getting the state `Acta.setState({appStateKey: value})`
- A one line straight forward way of subscribing application events in a component `Acta.subscribeState('appEventKey', handler);`.
- A hook for functional components `Acta.useActaEvent('appEventKey', handler);`
- A simple way of dispatching an event `Acta.dispatchEvent('appEventKey', value)`
- Optionnal Local or session storage persistence out of the box.
- Shared state between tabs and windows.
- Great performances since the store contains references to the callbacks instead of having to iterate on every reducer and stop only when it find the corresponding ones.
- Self cleaning methods to unsubscribe to states and events.
- Exposed global object that you can call from anywhere without having to setup and pass providers or decorators.
- Easy debuging from the browser console.

## Why another state manager?

React ecosystem already has state managers. [Redux](https://redux.js.org/) and [MobX](https://mobx.js.org/README.html)

The API of the most used application state managers (Redux and MobX) are great. But most teams using them are making a mess of their codebase. In the end, what matters for maintainability (the ability to make changes in your codebase confidently) is
