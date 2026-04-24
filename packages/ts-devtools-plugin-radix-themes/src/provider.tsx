import { useState, useEffect } from 'react'
import { Theme } from '@radix-ui/themes'
import type { RadixThemeConfig, RadixThemeDevtoolsProviderProps } from './types'

export function RadixThemeDevtoolsProvider({ plugin, children }: RadixThemeDevtoolsProviderProps) {
  const [theme, setTheme] = useState<RadixThemeConfig>(() => plugin.client.currentTheme)

  useEffect(() => {
    setTheme(plugin.client.currentTheme)
    const cleanup = plugin.client.on('theme-changed', (e) => {
      setTheme(e.payload)
    })
    const cleanupReset = plugin.client.on('theme-reset', () => {
      setTheme(plugin.client.defaultTheme)
    })
    return () => {
      cleanup()
      cleanupReset()
    }
  }, [plugin])

  return <Theme {...theme}>{children}</Theme>
}
