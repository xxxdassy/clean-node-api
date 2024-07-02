import { httpResponse } from '../protocols/http'

// syntax suggar
export const badRequest = (error: Error): httpResponse => ({
  statusCode: 400,
  body: error,
})
