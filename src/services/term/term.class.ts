// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Term, TermData, TermPatch, TermQuery } from './term.schema'

export type { Term, TermData, TermPatch, TermQuery }

export interface TermParams extends MongoDBAdapterParams<TermQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class TermService<ServiceParams extends Params = TermParams> extends MongoDBService<
  Term,
  TermData,
  TermParams,
  TermPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('terms')),
    multi: true
  }
}
