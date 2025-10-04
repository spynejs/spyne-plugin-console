### Spyne Plugin: Console

The **Spyne Console Plugin** is a customizable UI component for development that displays all channel actions and payloads in real time. It’s primarily intended for use in development mode to inspect application behavior and debug reactive flow within SpyneJS applications.

---

#### 📦 Installation

```bash
npm install spyne-plugin-console
```

---

#### 🚀 Usage

Import and register the plugin inside your application:

```js
import { SpynePluginConsole } from 'spyne-plugin-console';

SpyneApp.registerPlugin(
  new SpynePluginConsole({
    position: ['bottom', 'right'], // corner of the screen
    minimize: false,               // expands or collapses on page load
  })
);
```

- `position`: Defines the corner where the console appears.  
  Accepts combinations like `['bottom', 'right']` or `['top', 'left']`.

- `minimize`: If `true`, the console starts minimized on page load.

---

#### 🛠️ Development Mode Example

To avoid including the console in production builds, register it conditionally:

```js
if (process.env.NODE_ENV === 'development') {
  import('./dev-tools.js');
}
```

Then inside `dev-tools.js`:

```js
import { SpynePluginConsole } from 'spyne-plugin-console';

SpyneApp.registerPlugin(
  new SpynePluginConsole({
    position: ['bottom', 'right'],
    minimize: true,
  })
);
```
