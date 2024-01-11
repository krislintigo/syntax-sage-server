// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  termDataValidator,
  termPatchValidator,
  termQueryValidator,
  termResolver,
  termExternalResolver,
  termDataResolver,
  termPatchResolver,
  termQueryResolver
} from './term.schema'

import type { Application } from '../../declarations'
import { TermService, getOptions } from './term.class'
import { termPath, termMethods } from './term.shared'
import { $join } from '../../hooks/join'
import { $pipeline } from '../../hooks/pipeline'
import { $unpaginate } from '../../hooks/unpaginate'
import { $status } from './term.hooks'

export * from './term.class'
export * from './term.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const terms = (app: Application) => {
  // Register our service on the Feathers application
  app.use(termPath, new TermService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: termMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(termPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(termExternalResolver),
        schemaHooks.resolveResult(termResolver),
        schemaHooks.validateQuery(termQueryValidator),
        schemaHooks.resolveQuery(termQueryResolver)
      ],
      find: [$unpaginate()]
    },
    before: {
      all: [],
      find: [$status(), $join([{ as: 'word', from: 'words', localField: 'wordId' }]), $pipeline()],
      get: [],
      create: [schemaHooks.validateData(termDataValidator), schemaHooks.resolveData(termDataResolver)],
      patch: [schemaHooks.validateData(termPatchValidator), schemaHooks.resolveData(termPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [termPath]: TermService
  }
}
