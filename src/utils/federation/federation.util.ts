import { buildFederatedSchema as buildApolloFederationSchema, printSchema } from "@apollo/federation"
import { federationDirectives } from "@apollo/federation/dist/directives"
import { addResolversToSchema, GraphQLResolverMap } from "apollo-graphql"
import { specifiedDirectives } from "graphql"
import gql from "graphql-tag"
import { BuildSchemaOptions, buildSchemaSync, createResolversMap } from "type-graphql"

import { deprecatedDirective } from "../directives/deprecated.directive"

export const buildFederatedSchema = (
  options: Omit<BuildSchemaOptions, "skipCheck">,
  referenceResolvers?: GraphQLResolverMap<unknown>
) => {
  const schemaWithoutDirectives = buildSchemaSync({
    ...options,
    directives: [...specifiedDirectives, ...federationDirectives, ...(options.directives || [])],
    skipCheck: true
  })

  const { deprecatedDirectiveTransformer } = deprecatedDirective("deprecated")

  const schema = deprecatedDirectiveTransformer(schemaWithoutDirectives)

  const federatedSchema = buildApolloFederationSchema({
    typeDefs: gql(printSchema(schema)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolvers: createResolversMap(schema) as any
  })

  if (referenceResolvers) {
    addResolversToSchema(federatedSchema, referenceResolvers)
  }
  return federatedSchema
}
