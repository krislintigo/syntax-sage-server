// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, ObjectIdSchema, StringEnum } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TermService } from './term.class'
import { wordSchema } from '../word/word.schema'
import { createdAndUpdatedAt, dateString } from '../common.schema'
import { resolveQueryObjectId } from '@feathersjs/mongodb'

// Main data model schema
export const termSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    wordId: ObjectIdSchema(),
    word: Type.Ref(wordSchema),
    userId: ObjectIdSchema(),

    favorite: Type.Boolean(),
    studied: Type.Boolean(),
    viewed: Type.Boolean(),
    studies: Type.Object({
      match: Type.Number({ minimum: 0 }),
      audio: Type.Number({ minimum: 0 }),
      writing: Type.Number({ minimum: 0 })
    }),
    status: StringEnum(['not-studied', 'learning', 'mastered']),

    ...createdAndUpdatedAt,
    lastStudiedAt: dateString('date-time')
  },
  { $id: 'Term', additionalProperties: false }
)
export type Term = Static<typeof termSchema>
export const termValidator = getValidator(termSchema, dataValidator)
export const termResolver = resolve<Term, HookContext<TermService>>({
  word: virtual(async ({ wordId }, { app }) => {
    return await app.service('words').get(wordId as string)
  }),
  status: virtual(async ({ viewed, studies }): Promise<Term['status'] | undefined> => {
    const entries = Object.entries(studies)
    const notStudiedFlag = !viewed
    if (notStudiedFlag) return 'not-studied'
    const learningFlag = entries.some(([, value]) => value < 3)
    if (learningFlag) return 'learning'
    const masteredFlag = entries.every(([, value]) => value >= 3)
    if (masteredFlag) return 'mastered'
  })
})

export const termExternalResolver = resolve<Term, HookContext<TermService>>({})

// Schema for creating new entries
export const termDataSchema = Type.Omit(termSchema, ['_id', 'word', 'status'], {
  $id: 'TermData'
})
export type TermData = Static<typeof termDataSchema>
export const termDataValidator = getValidator(termDataSchema, dataValidator)
export const termDataResolver = resolve<Term, HookContext<TermService>>({})

// Schema for updating existing entries
export const termPatchSchema = Type.Partial(termDataSchema, {
  $id: 'TermPatch'
})
export type TermPatch = Static<typeof termPatchSchema>
export const termPatchValidator = getValidator(termPatchSchema, dataValidator)
export const termPatchResolver = resolve<Term, HookContext<TermService>>({})

// Schema for allowed query properties
export const termQueryProperties = Type.Omit(termSchema, ['word'])
export const termQuerySchema = Type.Intersect(
  [
    querySyntax(termQueryProperties),
    // Add additional query properties here
    Type.Object(
      {
        word: Type.Optional(Type.Object({})),

        $paginate: Type.Optional(Type.Boolean())
      },
      { additionalProperties: false }
    )
  ],
  { additionalProperties: false }
)
export type TermQuery = Static<typeof termQuerySchema>
export const termQueryValidator = getValidator(termQuerySchema, queryValidator)

export const termQueryResolver = resolve<TermQuery, HookContext<TermService>>({
  // @ts-expect-error wrong ts
  _id: resolveQueryObjectId
})
