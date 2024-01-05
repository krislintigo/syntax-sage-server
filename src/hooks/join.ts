import { type HookContext, type ServiceTypes } from '../declarations'
import { intersection } from 'lodash'

export const $join = (
  joins: Array<{
    localField: string
    from: keyof ServiceTypes
    as: string
  }>
) => {
  return async (ctx: HookContext) => {
    const flag =
      intersection(
        Object.keys(ctx.params.query),
        joins.map((join) => join.as)
      ).length > 0
    if (!flag) return

    const pipeline = []

    for (const { localField, from, as } of joins) {
      const asQuery = ctx.params.query[as]
      if (!asQuery) continue

      delete ctx.params.query[as]

      const lookupPipeline = []

      const { query: lookupQuery } = ctx.service.filterQuery(null, {
        ...ctx.params,
        query: asQuery
      })

      if (Object.keys(lookupQuery).length > 0) {
        lookupPipeline.push({ $match: lookupQuery })
      }

      pipeline.push({
        $lookup: {
          from,
          localField,
          foreignField: '_id',
          as,
          pipeline: lookupPipeline
        }
      })
      pipeline.push({
        $unwind: {
          path: `$${as}`,
          preserveNullAndEmptyArrays: false
        }
      })
    }

    const {
      query,
      filters: { $sort }
    } = ctx.service.filterQuery(null, ctx.params)

    if (Object.keys(query).length > 0) {
      pipeline.unshift({ $match: query })
    }

    if ($sort) pipeline.push({ $sort })

    ctx.params.customPipeline = true
    ctx.params.pipeline = pipeline
  }
}
