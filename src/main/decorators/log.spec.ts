import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeController = () => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 500,
        body: httpRequest.body,
      }
      return new Promise((resolve) => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub,
  }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle with correct values', async () => {
    const { sut, controllerStub } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
