const { ApolloServer, gql, PubSub } = require("apollo-server");
const pubsub = new PubSub();
// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
let books = [
  {
    author: "Me1",
    comment: "LOL1"
  },
  {
    author: "Me2",
    comment: "LOL2"
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type Subscription {
    postAdded: Post
  }

  type Post {
    comment: String
    author: String
  }

  type Mutation {
    addPost(author: String, comment: String): Post
  }

  type Query {
    posts: [Post]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Subscription: {
    postAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator(["post"])
    }
  },
  Query: {
    posts: () => books
  },
  Mutation: {
    addPost: (_, { author, comment }) => {
      books.push({
        author,
        comment
      });
      console.log(author, title);
      pubsub.publish("post", {
        postAdded: {
          author,
          comment
        }
      });
      return books[books.length - 1];
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen(3000).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url}`);
  console.log(subscriptionsUrl);
});
