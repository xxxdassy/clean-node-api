import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'
import { ok, serverError } from '../../presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve(null))
    }
  }

  return new LogErrorRepositoryStub()
}

const makeController = () => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())))
    }
  }

  return new ControllerStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@example.com',
  password: 'valid_password',
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@example.com',
    password: 'valid_password',
    passwordConfirmation: 'valid_password',
  },
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle with correct values', async () => {
    const { sut, controllerStub } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError())),
      )
    await sut.handle(makeFakeRequest())

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
