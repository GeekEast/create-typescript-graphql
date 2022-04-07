import { ApolloServerPluginInlineTraceDisabled, ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core"
import { ApolloServer } from "apollo-server-express"
import Container from "typedi"

import { GRAPHQL_DEBUG, GRAPHQL_INTROSPECTION } from "../enum"
import { ProjectResolver } from "../modules/project/resolver/project.resolver"
import { buildFederatedSchema } from "../utils/federation/federation.util"
import { ErrorFilter } from "../utils/middlewares/error.filter"

export const generateGraphqlServer = () => {
  // build federated schema
  const schema = buildFederatedSchema({
    resolvers: [ProjectResolver],
    container: Container,
    globalMiddlewares: [ErrorFilter],
    validate: false
  })

  // generate playground plugin
  const generatePlaygroundPlugins = () => {
    return ApolloServerPluginLandingPageLocalDefault()
  }

  // create apollo server
  const graphqlServer = new ApolloServer({
    schema,
    introspection: GRAPHQL_INTROSPECTION,
    debug: GRAPHQL_DEBUG,
    context: ({ req }) => ({ req: { headers: req.headers } }),
    plugins: [ApolloServerPluginInlineTraceDisabled(), generatePlaygroundPlugins()]
  })

  return graphqlServer
}
