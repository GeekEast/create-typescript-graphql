import { NextFunction, Request, Response } from "express"

import { SampleProvider } from "./bcrypt.provider"

export const registerProvidersMiddleware = () => async (_req: Request, _res: Response, next: NextFunction) => {
  await registerProviders()
  next()
}

export const registerProviders = async () => {
  SampleProvider.provide()
}
