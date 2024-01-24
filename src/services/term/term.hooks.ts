import type { HookContext } from '../../declarations'
import { type Document } from 'mongodb'

export const $status = () => (context: HookContext) => {
  const { status } = context.params.query
  if (!status) return

  delete context.params.query.status
  switch (status) {
    case 'not-studied':
      context.params.query.viewed = false
      break
    case 'learning':
      context.params.query.viewed = true
      context.params.query.$or = [
        { 'studies.match': { $lt: 3 } },
        { 'studies.writing': { $lt: 3 } },
        { 'studies.audio': { $lt: 3 } }
      ]
      break
    case 'mastered':
      context.params.query.viewed = true
      context.params.query.$and = [
        { 'studies.match': { $gte: 3 } },
        { 'studies.writing': { $gte: 3 } },
        { 'studies.audio': { $gte: 3 } }
      ]
      break
    default:
      break
  }
}

export const $repeat = () => async (ctx: HookContext) => {
  const repeat = ctx.params.query.$repeat
  delete ctx.params.query.$repeat

  if (!repeat) return

  const pipelineAlreadyExists = !!ctx.params.customPipeline

  const pipeline: Document[] = [
    {
      $addFields: {
        repeats: {
          $sum: [
            { $max: [{ $subtract: ['$studies.match', 3] }, 0] },
            { $max: [{ $subtract: ['$studies.writing', 3] }, 0] },
            { $max: [{ $subtract: ['$studies.audio', 3] }, 0] }
          ]
        }
      }
    },
    {
      $match: {
        repeats: { $lte: 10 }
      }
    },
    {
      $addFields: {
        yCoefficient: {
          $add: [2, { $multiply: [0.25, { $pow: ['$repeats', 2] }] }]
        }
      }
    },
    {
      $addFields: {
        currentDate: new Date(),
        lastStudiedAtDate: { $toDate: '$lastStudiedAt' }
      }
    },
    {
      $addFields: {
        dateDifference: {
          $subtract: ['$currentDate', '$lastStudiedAtDate']
        }
      }
    },
    {
      $addFields: {
        dateDifferenceInDays: {
          $divide: ['$dateDifference', 1000 * 60 * 60 * 24]
        }
      }
    },
    {
      $match: {
        $expr: {
          $gt: ['$dateDifferenceInDays', '$yCoefficient']
        }
      }
    },
    {
      $project: {
        repeats: 0,
        yCoefficient: 0,
        currentDate: 0,
        lastStudiedAtDate: 0,
        dateDifference: 0,
        dateDifferenceInDays: 0
      }
    }
  ]

  ctx.params.customPipeline = true
  if (pipelineAlreadyExists) {
    ctx.params.pipeline = [...ctx.params.pipeline, ...pipeline]
  } else {
    const { query } = ctx.service.filterQuery(null, ctx.params)

    if (Object.keys(query).length > 0) {
      pipeline.unshift({ $match: query })
    }
    ctx.params.pipeline = pipeline
  }
}
