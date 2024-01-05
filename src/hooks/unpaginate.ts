import { type HookContext } from '../declarations'
import { isNil } from 'lodash'
import { type NextFunction } from '@feathersjs/feathers'

export const $unpaginate = () => async (ctx: HookContext, next: NextFunction) => {
  const paginate = ctx.params.query.$paginate

  if (isNil(paginate)) {
    await next()
    return
  }

  ctx.params.paginate = paginate
  delete ctx.params.query.$paginate
  if (!paginate) {
    // console.log('UNPAGINATE')
    delete ctx.params.query.$limit
    delete ctx.params.query.$skip
  }

  await next()

  const data = ctx.result
  if (!Array.isArray(data)) return

  ctx.result = {
    data,
    skip: 0,
    limit: 0,
    total: data.length
  }
}
