import { type HookContext } from '../../declarations'
import { ObjectId } from 'mongodb'

export const $intersect = () => async (context: HookContext) => {
  const intersectId = context.params.query.$intersect
  delete context.params.query.$intersect
  if (!intersectId) return

  const pipeline = [
    {
      $lookup: {
        from: 'terms',
        localField: '_id',
        foreignField: 'wordId',
        as: 'matchedTerms',
        pipeline: [
          {
            $match: {
              userId: new ObjectId(intersectId) // resolver here
            }
          }
        ]
      }
    },
    {
      $match: {
        matchedTerms: {
          $eq: []
        }
      }
    }
  ]

  const { query } = context.service.filterQuery(null, context.params)

  if (Object.keys(query).length > 0) {
    pipeline.unshift({ $match: query })
  }

  context.params.customPipeline = true
  context.params.pipeline = pipeline

  // console.time('FILTER')
  // const wordIds = await context.app
  //   .service('terms')
  //   .find({ query: { userId: intersectId, $select: ['wordId'] }, paginate: false })
  // const res = context.result.data.filter(
  //   // @ts-expect-error ts error
  //   (item) => !wordIds.filter((word) => word.wordId.equals(item._id)).length
  // )
  // console.timeEnd('FILTER')
  // console.log()
}
