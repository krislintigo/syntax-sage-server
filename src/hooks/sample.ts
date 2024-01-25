import { type HookContext } from '../declarations'
import { type Document } from 'mongodb'

export const $sample = () => async (ctx: HookContext) => {
  const sample = ctx.params.query.$sample
  delete ctx.params.query.$sample

  if (!sample) return

  const pipelineAlreadyExists = !!ctx.params.customPipeline

  const pipeline: Document[] = [{ $sample: { size: sample } }]

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
