import { RadixThemeEventClient } from './client'
import { RadixThemePanel } from './panel'
import type { RadixThemePluginOptions } from './types'

export function createRadixThemePlugin(options: RadixThemePluginOptions = {}) {
  const client = new RadixThemeEventClient(options.defaultTheme)

  const plugin = {
    name: 'Radix Themes',
    render: <RadixThemePanel client={client} defaultTheme={options.defaultTheme} />,
    client,
  }

  return plugin
}
