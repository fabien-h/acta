<p align="center">
  <a href="https://fabien-h.github.io/acta/#/" target="_blank" rel="noopener noreferrer" >
    <br/>
    <img src="https://raw.githubusercontent.com/fabien-h/acta/master/docs/_media/acta-logo.png" alt="Storybook" width="220" />
    <br/><br/><br/>
  </a>
</p>

<p align="center">Super light dead simple state manager and event dispatcher for react. May you never ask yourself again "where are those props coming from?". <a href="http://acta.js.org/#/quickstart">Get to the quick start</a>. Or watch the 2 minutes video.</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=dHPcp_7UmDM" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/fabien-h/acta/master/docs/_media/short_tuto_video.jpg" alt="short tutorial thumbnail" width="300" />
  </a>
</p>

<br/>

[![badgen minzip](https://badgen.net/bundlephobia/minzip/acta)](https://bundlephobia.com/result?p=acta)
[![Build Status](https://travis-ci.org/fabien-h/acta.svg?branch=master)](https://travis-ci.org/fabien-h/acta)
[![Coverage Status](https://coveralls.io/repos/github/fabien-h/acta/badge.svg?branch=master)](https://coveralls.io/github/fabien-h/acta?branch=master)
![codacy code quality](https://api.codacy.com/project/badge/Grade/73e7fdaa376448c2835a23c3f4749c8f)
[![badgen typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
![badgen types included](https://badgen.net/npm/types/acta)
[![badgen mit licence](https://badgen.net/badge/license/MIT/blue)](https://en.wikipedia.org/wiki/MIT_License)
[![badgen npm version](https://badgen.net/npm/v/acta)](https://www.npmjs.com/package/acta)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

- **Explicit over implicit.**
- **Minimal dataflow: the component subscribing is the one using the data.**
- **Zero setup, no provider or observable system.**

## Acta is providing

- A unique global store with keys indexed values.
- A one line straight forward way of subscribing to the application state in a class component `Acta.subscribeState('appStateKey', 'localStateKey');`.
- A hook for functional components `const valueFromActa = Acta.useActaState('appStateKey');` that share states with class components.
- A simple way of setting / getting the state `Acta.setState({appStateKey: value})`.
- A one line straight forward way of subscribing application events in a class component `Acta.subscribeState('appEventKey', handler);`.
- A hook for functional components `Acta.useActaEvent('appEventKey', handler);` that share events. with class components.
- A simple way of dispatching an event `Acta.dispatchEvent('appEventKey', value)`.
- Optional local/session storage persistence.
- Shared states and events between tabs and windows.
- Great performances since the store contains references to the callbacks instead of having to iterate on every reducer and stop only when it find the corresponding ones.
- Self cleaning methods unsubscribing to states and events.
- Exposed global object that you can call from anywhere without having to setup and pass providers, wrappers or decorators.

In **Acta** states, you can store string, numbers, and booleans; in object literals and in arrays. Since all values stored have to be compatible with the local storage Maps, Sets or functions won’t work.

You don't need tooling to debug **Acta**. Juste type `Acta` in your browser console and see the object and the internals.

## Why another state manager?

React ecosystem already has excellent state managers. [Redux](https://redux.js.org/) and [MobX](https://mobx.js.org/README.html) are great tools. But teams tend to make a mess of their codebase with overcomplicated state management patterns because they have seen it work for big applications and online tutorials encouraging premature scaling optimizations.

Maintainability is the ability to make changes with confidence. If you cannot understand your dataflow instantly today and describe it in a simple sentence, it means that three months from now you will be lost in the layers of abstraction that you just created and that any modification will be a nightmare.

If an action calls a dispatcher to push updated data in a middleware that will look into a bunch a reducers to find the one that will transform the updated data to push them into a provider that will trigger a mapping from the transformed updated data into properties in a higher order function that wraps the parent of the component where the data will be displayed... Well, congratulations, you made the life of the next guy hell. And this is not a caricature, some applications have way more complicated dataflow. Sometimes it's required; but if I bet that it's not your case, I'll be right 99.9% of the time.

The goal of **Acta** is to make you forget about reducers, observers, maptoprops, providers, HOCs... Components are explicitly responsible for subscribing to the state or event. You can call for a complex data treatment inside the component. You can have actions that will be triggered. But the incoming data flow should be the most direct possible.

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
