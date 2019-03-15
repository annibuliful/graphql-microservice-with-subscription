const { HttpLink } = require("apollo-link-http");
const { split } = require("apollo-client-preset");
const { WebSocketLink } = require("apollo-link-ws");
const { getMainDefinition } = require("apollo-utilities");
const ws = require("ws");
const { SubscriptionClient } = require("subscriptions-transport-ws");
const fetch = require("node-fetch");
const {
  introspectSchema,
  makeRemoteExecutableSchema
} = require("graphql-tools");

module.exports = {
  getSchema: async (urlLink, wLink) => {
    const httpLink = new HttpLink({ uri: urlLink, fetch });
    const wsLink = new SubscriptionClient(
      wLink,
      {
        reconnect: true
      },
      ws
    );

    const link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
    );

    const schema = await introspectSchema(httpLink);
    const executableSchema = makeRemoteExecutableSchema({
      schema,
      link
    });
    return executableSchema;
  }
};
