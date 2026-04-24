import { EventClient } from '@tanstack/devtools-event-client'
import type { RadixThemeEvents } from './types'

export class RadixThemeEventClient extends EventClient<RadixThemeEvents> {
  constructor() {
    super({ pluginId: 'radix-themes' })
  }
}
