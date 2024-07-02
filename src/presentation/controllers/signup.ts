import { httpRequest, httpResponse } from '../protocols/http'
import MissingParamError from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

class SignUpController {
  handle(httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name', 'email']
    for (const fields of requiredFields) {
      if (!httpRequest.body[fields]) {
        return badRequest(new MissingParamError(fields))
      }
    }
  }
}

export default SignUpController
