import { ApolloServer, ExpressContext } from "apollo-server-express"
import express, { json, urlencoded } from "express"
import HTTP_CODE from "http-status-codes"

import { CONSTANT, NODE_ENV, SERVICE_PORT } from "../enum"
import { generateCORSoptions } from "../utils/cors/cors.util"
import { Logger } from "../utils/logger/logger.util"

export const start = async (graphqlServer: ApolloServer<ExpressContext>) => {
  // create express app
  const app = express()
  app.use(urlencoded({ extended: true }))
  app.use(json())

  // health check route
  app.get("/health", (_req, res) => {
    res.status(HTTP_CODE.OK).send(`welcome to ${CONSTANT.SERVICE_NAME} service`)
  })

  // start graphql server
  await graphqlServer.start()

  // add graphql to express app
  graphqlServer.applyMiddleware({
    app,
    path: CONSTANT.SERVICE_URL_SUFFIX,
    cors: generateCORSoptions()
  })

  // start express server
  app.listen(SERVICE_PORT, () =>
    Logger.info(`🚀 ${CONSTANT.SERVICE_NAME} service listening at ${SERVICE_PORT} in ${NODE_ENV} mode`)
  )
}
