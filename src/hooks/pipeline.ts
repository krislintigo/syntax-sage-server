import { type HookContext } from '@feathersjs/feathers'

export const $pipeline = () => async (ctx: HookContext) => {
  if (!ctx.params.customPipeline) return

  const {
    filters: { $limit: limit, $skip: skip }
  } = ctx.service.filterQuery(null, ctx.params)

  const pipeline = [
    ...ctx.params.pipeline,
    {
      $facet: {
        data: [{ $skip: skip }, ...(limit ? [{ $limit: limit }] : [])],
        total: [{ $count: 'count' }]
      }
    },
    {
      $project: {
        data: 1,
        total: { $arrayElemAt: ['$total.count', 0] }
      }
    }
  ]
  const result = await ctx.service._find({
    pipeline,
    paginate: false
  })
  const { data, total } = result[0]

  ctx.result = { data, limit, skip, total }
}
