# radix-themes-devtools

A [TanStack Devtools](https://tanstack.com/devtools/latest) plugin that lets you customize your [Radix UI Themes](https://www.radix-ui.com/themes) in real time — directly from the devtools panel.

Change accent color, gray, radius, scaling, appearance and panel background without touching your code, and see the changes live in your app.

> **Note:** TanStack Devtools is currently in alpha, so APIs may change.

---

## Requirements

| Peer dependency                   | Version   |
| --------------------------------- | --------- |
| `react`                           | `≥ 18`    |
| `react-dom`                       | `≥ 18`    |
| `@radix-ui/themes`                | `≥ 3`     |
| `@tanstack/devtools-event-client` | `≥ 0.0.1` |

---

## Installation

```bash
npm install radix-themes-devtools
# or
pnpm add radix-themes-devtools
# or
yarn add radix-themes-devtools
```

You also need TanStack Devtools for your framework:

```bash
npm install @tanstack/react-devtools @tanstack/devtools-event-client
```

---

## Usage

### 1. Create the plugin

```tsx
import { createRadixThemePlugin } from 'radix-themes-devtools'

const themePlugin = createRadixThemePlugin({
  defaultTheme: {
    accentColor: 'indigo',
    grayColor: 'slate',
    appearance: 'light',
    radius: 'medium',
    scaling: '100%',
    panelBackground: 'translucent',
  },
})
```

All `defaultTheme` options are optional.

### 2. Wrap your app with `RadixThemeDevtoolsProvider`

`RadixThemeDevtoolsProvider` wraps Radix's `<Theme>` internally and listens for changes from the devtools panel. Replace your existing `<Theme>` wrapper with it.

```tsx
import { RadixThemeDevtoolsProvider } from 'radix-themes-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import '@radix-ui/themes/styles.css'

export default function App() {
  return (
    <RadixThemeDevtoolsProvider plugin={themePlugin}>
      <MyApp />
      <TanStackDevtools plugins={[themePlugin]} />
    </RadixThemeDevtoolsProvider>
  )
}
```

> **Tip:** `TanStackDevtools` only renders in development by default, so there's nothing extra to do for production.

That's it. Open the TanStack Devtools panel and go to the **Radix Themes** tab.

---

## API

### `createRadixThemePlugin(options?)`

Creates the plugin object to pass to `<TanStackDevtools plugins={[...]} />`.

| Option         | Type               | Description                         |
| -------------- | ------------------ | ----------------------------------- |
| `defaultTheme` | `RadixThemeConfig` | Initial theme values for the panel. |

Returns a plugin object with a `.client` property (the `EventClient`) if you need to listen to theme changes programmatically.

---

### `RadixThemeDevtoolsProvider`

Wraps Radix's `<Theme>` and syncs it with the devtools panel.

| Prop       | Type                                      | Required |
| ---------- | ----------------------------------------- | -------- |
| `plugin`   | Return type of `createRadixThemePlugin()` | ✅       |
| `children` | `React.ReactNode`                         | ✅       |

---

### `RadixThemeConfig`

All fields are optional and map 1:1 to Radix's `<Theme>` props:

```ts
type RadixThemeConfig = {
  accentColor?:    ThemeProps['accentColor']     // e.g. 'indigo', 'blue', 'mint'...
  grayColor?:      ThemeProps['grayColor']       // 'gray' | 'mauve' | 'slate' | ...
  appearance?:     ThemeProps['appearance']      // 'light' | 'dark'
  radius?:         ThemeProps['radius']          // 'none' | 'small' | 'medium' | 'large' | 'full'
  scaling?:        ThemeProps['scaling']         // '90%' | '95%' | '100%' | '105%' | '110%'
  panelBackground? ThemeProps['panelBackground'] // 'solid' | 'translucent'
}
```

---

## License

MIT © [Javier Pérez](https://github.com/JavierBrooktec)
