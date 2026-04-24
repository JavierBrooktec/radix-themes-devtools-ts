import { describe, it, expect, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { RadixThemeDevtoolsProvider } from '../provider'
import { createRadixThemePlugin } from '../plugin'
import type { RadixThemeConfig } from '../types'

// Mock @radix-ui/themes to capture the props passed to <Theme>
let lastThemeProps: Record<string, unknown> = {}
vi.mock('@radix-ui/themes', () => ({
  Theme: (props: Record<string, unknown>) => {
    const { children, ...rest } = props
    lastThemeProps = rest
    return <div data-testid="radix-theme">{children as React.ReactNode}</div>
  },
}))

/**
 * Simulate what the TanStack event bus does: dispatch a CustomEvent on window
 * with the format `${pluginId}:${eventSuffix}` and detail = { payload }.
 *
 * This is how events reach `client.on()` listeners in production.
 * When the bus is stopped (devtools closed), these events stop flowing.
 */
function simulateBusEvent(event: string, payload: unknown) {
  window.dispatchEvent(
    new CustomEvent(`radix-themes:${event}`, {
      detail: { payload, type: `radix-themes:${event}`, pluginId: 'radix-themes' },
    }),
  )
}

function renderProvider(plugin: ReturnType<typeof createRadixThemePlugin>) {
  return render(
    <RadixThemeDevtoolsProvider plugin={plugin}>
      <span>app</span>
    </RadixThemeDevtoolsProvider>,
  )
}

describe('theme persistence', () => {
  it('initializes with defaultTheme from plugin', () => {
    const plugin = createRadixThemePlugin({
      defaultTheme: { accentColor: 'red', radius: 'large' },
    })

    renderProvider(plugin)

    expect(lastThemeProps).toMatchObject({ accentColor: 'red', radius: 'large' })
  })

  it('updates theme when receiving theme-changed via event bus', () => {
    const plugin = createRadixThemePlugin({
      defaultTheme: { accentColor: 'indigo' },
    })

    renderProvider(plugin)

    const newTheme: RadixThemeConfig = { accentColor: 'red', appearance: 'dark' }
    act(() => {
      plugin.client.currentTheme = newTheme
      simulateBusEvent('theme-changed', newTheme)
    })

    expect(lastThemeProps).toMatchObject({ accentColor: 'red', appearance: 'dark' })
  })

  it('keeps theme after event bus goes silent (devtools close)', () => {
    const plugin = createRadixThemePlugin({
      defaultTheme: { accentColor: 'indigo' },
    })

    renderProvider(plugin)

    // Simulate user changing theme via panel
    const customTheme: RadixThemeConfig = {
      accentColor: 'red',
      grayColor: 'sage',
      appearance: 'dark',
      radius: 'full',
      scaling: '110%',
      panelBackground: 'solid',
    }
    act(() => {
      plugin.client.currentTheme = customTheme
      simulateBusEvent('theme-changed', customTheme)
    })

    // Event bus stops (devtools close) — no more events
    // Theme must persist
    expect(lastThemeProps).toMatchObject(customTheme)
  })

  it('restores theme from client.currentTheme on provider remount', () => {
    const plugin = createRadixThemePlugin({
      defaultTheme: { accentColor: 'indigo' },
    })

    const { unmount } = renderProvider(plugin)

    // User changes theme
    const customTheme: RadixThemeConfig = {
      accentColor: 'crimson',
      appearance: 'dark',
      radius: 'full',
    }
    act(() => {
      plugin.client.currentTheme = customTheme
      simulateBusEvent('theme-changed', customTheme)
    })

    expect(lastThemeProps).toMatchObject({ accentColor: 'crimson' })

    // Provider unmounts (devtools close triggers remount)
    unmount()

    // Provider remounts — should recover theme from client.currentTheme
    renderProvider(plugin)

    expect(lastThemeProps).toMatchObject({
      accentColor: 'crimson',
      appearance: 'dark',
      radius: 'full',
    })
  })

  it('client.currentTheme tracks the latest value set by the panel', () => {
    const plugin = createRadixThemePlugin({
      defaultTheme: { accentColor: 'indigo' },
    })

    expect(plugin.client.currentTheme).toEqual({ accentColor: 'indigo' })

    // Panel sets currentTheme directly (not via events)
    plugin.client.currentTheme = { accentColor: 'red', appearance: 'dark' }
    expect(plugin.client.currentTheme).toEqual({ accentColor: 'red', appearance: 'dark' })
  })

  it('resets to defaultTheme on theme-reset event', () => {
    const defaultTheme: RadixThemeConfig = { accentColor: 'indigo', radius: 'medium' }
    const plugin = createRadixThemePlugin({ defaultTheme })

    renderProvider(plugin)

    // Change theme
    const customTheme: RadixThemeConfig = { accentColor: 'red', appearance: 'dark' }
    act(() => {
      plugin.client.currentTheme = customTheme
      simulateBusEvent('theme-changed', customTheme)
    })
    expect(lastThemeProps).toMatchObject({ accentColor: 'red' })

    // Reset
    act(() => {
      plugin.client.currentTheme = defaultTheme
      simulateBusEvent('theme-reset', undefined)
    })

    expect(lastThemeProps).toMatchObject(defaultTheme)
  })

  it('survives multiple mount/unmount cycles', () => {
    const plugin = createRadixThemePlugin({
      defaultTheme: { accentColor: 'indigo' },
    })

    // First mount — apply custom theme
    let result = renderProvider(plugin)
    act(() => {
      const theme: RadixThemeConfig = { accentColor: 'teal', scaling: '105%' }
      plugin.client.currentTheme = theme
      simulateBusEvent('theme-changed', theme)
    })
    expect(lastThemeProps).toMatchObject({ accentColor: 'teal', scaling: '105%' })

    // Unmount & remount (cycle 1)
    result.unmount()
    result = renderProvider(plugin)
    expect(lastThemeProps).toMatchObject({ accentColor: 'teal', scaling: '105%' })

    // Change theme again
    act(() => {
      const theme: RadixThemeConfig = { accentColor: 'pink', appearance: 'dark' }
      plugin.client.currentTheme = theme
      simulateBusEvent('theme-changed', theme)
    })

    // Unmount & remount (cycle 2)
    result.unmount()
    renderProvider(plugin)
    expect(lastThemeProps).toMatchObject({ accentColor: 'pink', appearance: 'dark' })
  })
})
