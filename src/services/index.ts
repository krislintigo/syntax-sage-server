import { terms } from './term/term'
import { users } from './user/user'
import { words } from './word/word'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(terms)
  app.configure(users)
  app.configure(words)
  // All services will be registered here
}
