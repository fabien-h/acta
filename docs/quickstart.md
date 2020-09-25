# Quickstart

This quickstart cover most of **Acta** in 2 minutes.

There is also a short video if you prefer that format.

<p>
  <a href="https://www.youtube.com/watch?v=dHPcp_7UmDM" target="_blank" rel="noopener noreferrer">
    <img src="/_media/short_tuto_video.jpg" alt="short tutorial thumbnail" width="300" />
  </a>
</p>

## Install

This quickstart assumes that you already have a functionning [React](https://reactjs.org/) application. If not, you can initialize one with [create react app](https://create-react-app.dev/docs/getting-started/).

Run `npm install acta` or `yarn add acta`.

## Subscribe to a state and an event

In a class component, add this code:

```typescript
// imports
import Acta from 'acta'

// componentDidMount method
componentDidMount(): void {
  Acta.subscribeState('ACTA_STATE_KEY', 'local_state_key' this);
  Acta.subscribeEvent(
    'ACTA_EVENT_KEY',
    callback: (notification) => alert(notification),
    context: this,
  );
}

// render method
render() {
  return <div>
    {/* Your render function already exists, just add the following line */}
     <p>value from acta: {this.state.local_state_key || 'Not set yet'}</p>
  </div>
}
```

In a functional component, add this code:

```typescript
// imports
import Acta from 'acta';

// functional component body
const valueFromActa = Acta.useActaState('ACTA_STATE_KEY');
Acta.useActaEvent('ACTA_EVENT_KEY', (notification) => alert(notification));

<div>
  {/* Your render function already exists, just add the following line */}
  <p>value from acta: {valueFromActa || 'Not set yet'}</p>
</div>;
```

## Set a state

In your browser console, run `Acta.setState({ACTA_STATE_KEY: 'This is a value I’ve just set: ' + Math.random() }, 'localStorage')`. Repeat to see it in action. Reload the page, the state was saved in the local storage.

## Dispatch an event

In your browser console, run `Acta.dispatchEvent('ACTA_EVENT_KEY', 'This is a value I’ve just set: ' + Math.random())`. Your browser alerts
