import { ApolloError } from "apollo-server-core"
import axios from "axios"
import { ArgumentValidationError, MiddlewareInterface, NextFn, ResolverData } from "type-graphql"
import { Service } from "typedi"

import { Logger } from "../logger/logger.util"

@Service()
// ! AuthGuard Error won't go through Error Filter
export class ErrorFilter implements MiddlewareInterface {
  async use({ context: _context }: ResolverData, next: NextFn): Promise<void> {
    try {
      return await next()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Logger.error("======================= Global Error Boundary =====================")
      Logger.error(err?.name)
      Logger.error(err?.message)
      Logger.error(err?.errors)
      Logger.error(err)

      if (axios.isAxiosError(err)) {
        Logger.error("=========== Axios Error Filter ============")
        Logger.error(`${err?.config?.method} ${err?.config?.baseURL}${err?.config?.url} ${err?.response?.status}`)
        Logger.error("=========== Axios Error Filter ============")
        if (err?.response?.status === 500) throw new ApolloError("internal services might not available currently")
      }

      if (err instanceof ArgumentValidationError) {
        Logger.error("=========== Dto Validation Error Filter ============")
        err?.validationErrors?.map((err) => {
          Logger.error(`${err.property}: ${err.value}`)
          Logger.error(err.constraints)
        })
        Logger.error("=========== Dto Validation Error Filter ============")
      }
      Logger.error("======================= Global Error Boundary =====================")

      throw err
    }
  }
}
