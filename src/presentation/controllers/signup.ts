import { httpRequest, httpResponse } from '../protocols/http'
import MissingParamError from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'

class SignUpController implements Controller {
  handle(httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const fields of requiredFields) {
      if (!httpRequest.body[fields]) {
        return badRequest(new MissingParamError(fields))
      }
    }
  }
}

export default SignUpController
