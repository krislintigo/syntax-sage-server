// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Word, WordData, WordPatch, WordQuery, WordService } from './word.class'

export type { Word, WordData, WordPatch, WordQuery }

export type WordClientService = Pick<WordService<Params<WordQuery>>, (typeof wordMethods)[number]>

export const wordPath = 'words'

export const wordMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const wordClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(wordPath, connection.service(wordPath), {
    methods: wordMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [wordPath]: WordClientService
  }
}
