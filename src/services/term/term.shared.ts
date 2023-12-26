// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Term, TermData, TermPatch, TermQuery, TermService } from './term.class'

export type { Term, TermData, TermPatch, TermQuery }

export type TermClientService = Pick<TermService<Params<TermQuery>>, (typeof termMethods)[number]>

export const termPath = 'terms'

export const termMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const termClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(termPath, connection.service(termPath), {
    methods: termMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [termPath]: TermClientService
  }
}
