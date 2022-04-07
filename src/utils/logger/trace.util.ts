import { highlight } from "cli-highlight"
import safeStringify from "fast-safe-stringify"
import { performance } from "perf_hooks"

import { Logger } from "./logger.util"

interface Options {
  disable?: string[]
  perf?: boolean
  memWatch?: boolean
  logInput?: {
    enabled?: boolean
    beautify?: boolean
  }
}

const FuncTrace = (
  className: string,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  inputLog: {
    enabled?: boolean
    beautify?: boolean
  },
  perf = false,
  memWatch = false
) => {
  const lowerClassName = className.toLowerCase()
  let layer = ""
  if (lowerClassName.includes("service")) layer = "Service"
  if (lowerClassName.includes("repo")) layer = "Repository"
  if (lowerClassName.includes("resolver")) layer = "Resolver"
  if (lowerClassName.includes("controller")) layer = "Controller"

  const path = `${className}.${propertyKey}`
  const originalMethod = descriptor.value
  descriptor.value = function (...args: unknown[]) {
    logInput(layer, path, args, inputLog.enabled, inputLog.beautify)

    // pre: mem monitor
    let startMemory: number
    if (memWatch) startMemory = process.memoryUsage().rss

    // pre: execution monitor
    let startTime: number
    if (perf) startTime = performance.now()

    // execute function
    const result = originalMethod.apply(this, args)

    // post: execution monitor
    if (perf) {
      const finishTime = performance.now()
      const time = Math.floor((finishTime - startTime) * 100) / 100
      if (time < 10) {
        Logger.info(`${layer}:Performance:Info: ${path} Execution time: ${time} milliseconds`)
      } else if (time < 20) {
        Logger.warn(`${layer}:Performance:Warning: ${path} Execution time: ${time} milliseconds`)
      } else {
        Logger.error(`${layer}:Performance:Error: ${path} Execution time: ${time} milliseconds`)
      }
    }

    // post: mem monitor
    if (memWatch) {
      const finishMemory = process.memoryUsage().rss
      const memoryMargin = bytesToMB(finishMemory - startMemory)
      if (memoryMargin < 5) {
        Logger.info(`${layer}:Performance:Info: ${path} Consumed memory: ${memoryMargin} MB`)
      } else if (memoryMargin < 10) {
        Logger.warn(`${layer}:Performance:Warning: ${path} Consumed memory: ${memoryMargin} MB`)
      } else {
        Logger.error(`${layer}:Performance:Error: ${path} Consumed memory: ${memoryMargin} MB`)
      }
    }

    Logger.info(`${layer} Layer: ${path} ended`)
    return result
  }
  return descriptor
}

const logInput = (layer: string, path: string, args: unknown, enabled = true, beautify = false) => {
  if (!enabled) return

  Logger.info(`${layer} Layer: ${path} started`)
  Logger.info(`============= ${layer} Layer: ${path} input arguments =============`)
  beautify ? Logger.info(highlight(safeStringify(args, null, 2)), false) : Logger.info(safeStringify(args))
  Logger.info(`============= ${layer} Layer: ${path} input arguments =============`)
}

const bytesToMB = (bytes: number) => Math.round(bytes / 1024 / 1024)

/**
 * @param option:
 * - disable: disable specific function trace within a class
 * - perf: enable performance monitor
 * - memWatch: enable memory monitor
 * - logInput: {
 *  enabled: enable input log
 *  beautify: enable input log beautify
 * }
 *
 * e.g @Trace({ perf: true, logInput: { enabled: true, beautify: true } })
 * @returns {MethodDecorator} - decorator
 */
export function Trace({
  disable = [],
  perf = false,
  memWatch = false,
  logInput = { enabled: true, beautify: false }
}: Options): ClassDecorator {
  return (target: Function) => {
    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
      // ignore constructor and disabled class method
      if (propertyName === "constructor") continue
      if (!!disable && disable.includes(propertyName)) continue

      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName)
      descriptor.configurable = true
      descriptor.writable = true
      const isMethod = descriptor.value instanceof Function
      // ignore attributes
      if (!isMethod) continue

      // modify the method
      const modifiedDescriptor = FuncTrace(target.name, propertyName, descriptor, logInput, perf, memWatch)

      // apply the change
      Object.defineProperty(target.prototype, propertyName, modifiedDescriptor)
    }
  }
}
