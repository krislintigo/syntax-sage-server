// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Word, WordData, WordPatch, WordQuery } from './word.schema'

export type { Word, WordData, WordPatch, WordQuery }

export interface WordParams extends MongoDBAdapterParams<WordQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class WordService<ServiceParams extends Params = WordParams> extends MongoDBService<
  Word,
  WordData,
  WordParams,
  WordPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('words'))
  }
}
