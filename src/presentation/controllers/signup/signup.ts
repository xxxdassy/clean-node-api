import {
  Controller,
  EmailValidator,
  httpRequest,
  httpResponse,
  AddAccount,
} from './signup-protocols'

import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle(httpRequest: httpRequest): Promise<httpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ]
      for (const fields of requiredFields) {
        if (!httpRequest.body[fields]) {
          return badRequest(new MissingParamError(fields))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}

export default SignUpController
