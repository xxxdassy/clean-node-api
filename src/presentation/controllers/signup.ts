import { httpRequest, httpResponse } from '../protocols/http'
import MissingParamError from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

class SignUpController {
  handle(httpRequest: httpRequest): httpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}

export default SignUpController
