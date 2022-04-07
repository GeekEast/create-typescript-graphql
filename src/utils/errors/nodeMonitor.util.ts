import { Logger } from "../logger/logger.util"

export const startNodeProcessErrorMonitor = () => {
  process.on("unhandledRejection", (err) => {
    Logger.error(err)
  })

  process.on("uncaughtException", (err) => {
    Logger.error(err)
  })
}
