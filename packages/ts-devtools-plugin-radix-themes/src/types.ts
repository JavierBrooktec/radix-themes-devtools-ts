import type { ThemeProps } from '@radix-ui/themes'

export type RadixThemeConfig = Pick<
  ThemeProps,
  'accentColor' | 'grayColor' | 'appearance' | 'radius' | 'scaling' | 'panelBackground'
>

export type RadixThemeEvents = {
  'theme-changed': RadixThemeConfig
  'theme-reset': void
}

export interface RadixThemePluginOptions {
  defaultTheme?: RadixThemeConfig
}

export interface RadixThemeDevtoolsProviderProps {
  plugin: ReturnType<typeof import('./plugin').createRadixThemePlugin>
  children: React.ReactNode
}
