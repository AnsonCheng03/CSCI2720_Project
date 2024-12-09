import { InferResolvers } from "garph";
import { YogaInitialContext } from "graphql-yoga";
import { queryType } from "./schema";
import { VenueGQL, UserGQL, EventGQL, CommentGQL } from "./schema";
import { getUsers } from "@/app/DatabaseProvider/Mutation/User";
import { downloadEventData } from "@/app/DatabaseProvider/Mutation/Event";
import { downloadVenueData } from "@/app/DatabaseProvider/Mutation/Venue";
import { getComments } from "@/app/DatabaseProvider/Mutation/Comment";

type Resolvers = InferResolvers<
  {
    Query: typeof queryType;
  },
  { context: YogaInitialContext }
>;

export const resolvers: Resolvers = {
  Query: {
    getVenues: async (_, __, ctx) => {
      const venues = await downloadVenueData();
      console.log(venues);
      return JSON.parse(venues);
    },
    getUsers: async (_, __, ctx) => {
      const users = await getUsers();
      return JSON.parse(users);
    },
    getEvents: async (_, __, ctx) => {
      const events = await downloadEventData();
      return JSON.parse(events);
    },
    getComments: async (_, __, ctx) => {
      const comments = await getComments();
      return JSON.parse(comments);
    },
  },
};
