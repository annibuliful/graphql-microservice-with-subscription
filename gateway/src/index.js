const { ApolloServer } = require("apollo-server");
const { getSchema } = require("./remote");
const { mergeSchemas } = require("graphql-tools");
const start = async () => {
  try {
    const serviceOne = await getSchema(
      "http://localhost:4000/graphql",
      "ws://localhost:4000/graphql"
    );
    const serviceTwo = await getSchema(
      "http://localhost:3000/",
      "ws://localhost:3000/graphql"
    );

    const schema = mergeSchemas({
      schemas: [serviceOne, serviceTwo]
    });
    const server = new ApolloServer({ schema });

    server.listen(3030).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
};
start();
