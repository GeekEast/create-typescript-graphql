import "reflect-metadata"

import deepEqual from "deep-equal"
import prettyjson from "prettyjson"

import { resetContainer } from "./utils/di/di.util"

beforeEach(() => {
  jest.resetAllMocks()
  jest.restoreAllMocks()
  resetContainer()
})

expect.extend({
  toHaveBeenCalledWithInclude(f: jest.Mock<any, any>, ...args: any[]): any {
    const include = f.mock.calls.some((s) => deepEqual(s, args))
    if (include) return { message: () => "", pass: true }

    const message = `
${f.name} has been called with 
${prettyjson.render(f.mock.calls)}

expected include 
${prettyjson.render(args)}
    `
    return { message: () => message, pass: false }
  }
})
