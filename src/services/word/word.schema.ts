// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema, StringEnum } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { WordService } from './word.class'
import { createdAndUpdatedAt } from '../common.schema'
import { resolveQueryObjectId } from '@feathersjs/mongodb'

// Main data model schema
export const wordSchema = Type.Object(
  {
    _id: ObjectIdSchema(),

    course: StringEnum(['rus-fin']),
    original: Type.String(),
    local: Type.String(),
    english: Type.String(),

    notes: Type.Object({
      annotation: Type.String(),
      grammar: Type.String()
    }),
    categories: Type.Array(Type.String()),

    ...createdAndUpdatedAt
  },
  { $id: 'Word', additionalProperties: false }
)
export type Word = Static<typeof wordSchema>
export const wordValidator = getValidator(wordSchema, dataValidator)
export const wordResolver = resolve<Word, HookContext<WordService>>({})

export const wordExternalResolver = resolve<Word, HookContext<WordService>>({})

// Schema for creating new entries
export const wordDataSchema = Type.Omit(wordSchema, ['_id'], {
  $id: 'WordData'
})
export type WordData = Static<typeof wordDataSchema>
export const wordDataValidator = getValidator(wordDataSchema, dataValidator)
export const wordDataResolver = resolve<Word, HookContext<WordService>>({})

// Schema for updating existing entries
export const wordPatchSchema = Type.Partial(wordDataSchema, {
  $id: 'WordPatch'
})
export type WordPatch = Static<typeof wordPatchSchema>
export const wordPatchValidator = getValidator(wordPatchSchema, dataValidator)
export const wordPatchResolver = resolve<Word, HookContext<WordService>>({})

// Schema for allowed query properties
export const wordQueryProperties = Type.Omit(wordSchema, [])
export const wordQuerySchema = Type.Intersect(
  [
    querySyntax(wordQueryProperties, {
      original: { $regex: Type.String(), $options: Type.String() },
      local: { $regex: Type.String(), $options: Type.String() },
      english: { $regex: Type.String(), $options: Type.String() }
    }),
    // Add additional query properties here
    Type.Object(
      {
        $intersect: Type.Optional(Type.String()),
        $paginate: Type.Optional(Type.Boolean())
      },
      { additionalProperties: false }
    )
  ],
  { additionalProperties: false }
)
export type WordQuery = Static<typeof wordQuerySchema>
export const wordQueryValidator = getValidator(wordQuerySchema, queryValidator)
export const wordQueryResolver = resolve<WordQuery, HookContext<WordService>>({
  // @ts-expect-error wrong ts
  _id: resolveQueryObjectId
})
