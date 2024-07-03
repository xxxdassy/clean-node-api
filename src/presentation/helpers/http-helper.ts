import { ServerError } from '../errors/server-error'
import { httpResponse } from '../protocols/http'

// syntax suggar
export const badRequest = (error: Error): httpResponse => ({
  statusCode: 400,
  body: error,
})

export const serverError = (): httpResponse => ({
  statusCode: 500,
  body: new ServerError(),
})
