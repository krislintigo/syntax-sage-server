import type { HookContext } from '../../declarations'

export const $status = () => (context: HookContext) => {
  const { status } = context.params.query
  if (!status) return

  console.log(context.params.query)
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
  console.log('updated!', context.params.query)
}
