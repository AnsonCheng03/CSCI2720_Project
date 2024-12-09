import { InferResolvers } from "garph";
import { YogaInitialContext } from "graphql-yoga";

type Resolvers = InferResolvers<
  { Query: typeof queryType; Mutation: typeof mutationType },
  { context: YogaInitialContext }
>;

export const resolvers: Resolvers = {
  Query: {
    getTodos: async (_, __, ctx) => {
      // Placeholder function
      throw new Error("Not implemented");
    },
  },
  Mutation: {
    addTodo: async (_, { title }, ctx) => {
      // Placeholder function
      throw new Error("Not implemented");
    },
    removeTodo: async (_, { id }, ctx) => {
      // Placeholder function
      throw new Error("Not implemented");
    },
  },
};
