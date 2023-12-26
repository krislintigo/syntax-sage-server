import { resolve } from '@feathersjs/schema'
import { type HookContext } from './declarations'

interface CreatedAndUpdatedAt {
  createdAt: string
  updatedAt: string
}

export const appCreateResolver = resolve<CreatedAndUpdatedAt, HookContext>({
  createdAt: async () => new Date().toISOString(),
  updatedAt: async () => new Date().toISOString()
})

export const appPatchResolver = resolve<CreatedAndUpdatedAt, HookContext>({
  updatedAt: async () => new Date().toISOString()
})
