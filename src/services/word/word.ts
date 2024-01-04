// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  wordDataValidator,
  wordPatchValidator,
  wordQueryValidator,
  wordResolver,
  wordExternalResolver,
  wordDataResolver,
  wordPatchResolver,
  wordQueryResolver
} from './word.schema'

import type { Application } from '../../declarations'
import { WordService, getOptions } from './word.class'
import { wordPath, wordMethods } from './word.shared'
import { $intersect } from '../../hooks/$intersect'
import { NullableAdapterId } from '@feathersjs/mongodb'
import { ServiceParams } from '@feathersjs/transport-commons/lib/http'

export * from './word.class'
export * from './word.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const words = (app: Application) => {
  // Register our service on the Feathers application
  app.use(wordPath, new WordService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: wordMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(wordPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(wordExternalResolver),
        schemaHooks.resolveResult(wordResolver)
      ],
      find: [$intersect()]
    },
    before: {
      all: [/* schemaHooks.validateQuery(wordQueryValidator) */ schemaHooks.resolveQuery(wordQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(wordDataValidator), schemaHooks.resolveData(wordDataResolver)],
      patch: [schemaHooks.validateData(wordPatchValidator), schemaHooks.resolveData(wordPatchResolver)],
      remove: []
    },
    after: {
      all: [],
      patch: [
        (ctx) => {
          console.log(ctx.event)
        }
      ],
      remove: [
        async (context) => {
          await context.app.service('terms').remove(null, { query: { wordId: context.id } })
        }
      ]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [wordPath]: WordService
  }
}
