import type { HookContext } from '../../declarations'

export const $status = () => (context: HookContext) => {
  const { status } = context.params.query
  if (!status) return

  console.log(context.params.query)
  delete context.params.query.status
  switch (status) {
    case 'not-studied':
      context.params.query.$and = [{ 'studies.match': 0 }, { 'studies.writing': 0 }, { 'studies.audio': 0 }]
      break
    case 'learning':
      context.params.query.$and = [
        {
          $or: [
            { 'studies.match': { $gt: 0 } },
            { 'studies.writing': { $gt: 0 } },
            { 'studies.audio': { $gt: 0 } }
          ]
        },
        {
          $or: [
            { 'studies.match': { $lt: 3 } },
            { 'studies.writing': { $lt: 3 } },
            { 'studies.audio': { $lt: 3 } }
          ]
        }
      ]
      break
    case 'mastered':
      context.params.query.$and = [
        { 'studies.match': { $gte: 3 } },
        { 'studies.writing': { $gte: 3 } },
        { 'studies.audio': { $gte: 3 } }
      ]
      break
    default:
      break
  }
  console.log('updated!', context.params.query)
}
