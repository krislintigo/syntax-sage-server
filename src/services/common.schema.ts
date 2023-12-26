import { Type } from '@feathersjs/typebox'

export const createdAndUpdatedAt = {
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
}

export const dateString = <T extends 'date' | 'date-time'>(format: T) =>
  Type.Union([Type.String({ format }), Type.Literal('')])
