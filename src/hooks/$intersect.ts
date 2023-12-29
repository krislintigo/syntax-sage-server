import { type HookContext } from '../declarations'
import { type NextFunction } from '@feathersjs/feathers'
import { type Word } from '../services/word/word.schema'

export const $intersect = () => async (context: HookContext, next: NextFunction) => {
  const intersectId = context.params.query.$intersect
  delete context.params.query.$intersect
  if (!intersectId) return await next()

  await next()

  const wordIds = await context.app
    .service('terms')
    .find({ query: { userId: intersectId, $select: ['wordId'] }, paginate: false })
  console.log(wordIds)
  console.log(context.result.data.length)
  context.result.data = context.result.data.filter(
    // @ts-expect-error ts error
    (item: Word) => !wordIds.filter((word) => word.wordId.equals(item._id)).length
  )
  console.log(context.result.data.length)
}
