import { GarphSchema } from "garph";

export const g = new GarphSchema();

export const VenueGQL = g.type("Venue", {
  _id: g.string().description("Unique identifier for the venue"),
  venuec: g.string().description("Venue name in Chinese"),
  venuee: g.string().description("Venue name in English"),
  latitude: g.float().description("Latitude of the venue location"),
  longitude: g.float().description("Longitude of the venue location"),
  comment: g
    .string()
    .list()
    .optional()
    .description("Optional comments for the venue"),
});

export const UserGQL = g.type("User", {
  userName: g.string().description("Unique username for the user"),
  // password: g.string().description("Password for the user"),
  role: g.string().description("Role of the user"),
  favouriteVenue: g
    .ref(VenueGQL)
    .list()
    .optional()
    .description("List of favorite venues for the user"),
  darkMode: g.boolean().optional().description("Preference for dark mode"),
});

export const EventGQL = g.type("Event", {
  _id: g.string().description("Unique identifier for the event"),
  title: g.string().description("Title of the event"),
  venue: g.ref(VenueGQL).description("Venue associated with the event"),
  predate: g.string().description("Date of the event"),
  description: g.string().description("Description of the event"),
  presenter: g.string().description("Presenter or organizer of the event"),
  price: g.string().description("Price of the event"),
  quota: g.int().optional().description("Quota for the number of attendees"),
  joinedUsers: g
    .ref(UserGQL)
    .list()
    .optional()
    .description("Users who joined the event"),
  likedUsers: g
    .ref(UserGQL)
    .list()
    .optional()
    .description("Users who liked the event"),
  fromDownload: g
    .boolean()
    .optional()
    .description("Indicates if the event was downloaded"),
});

export const CommentGQL = g.type("Comment", {
  userName: g.string().description("Username of the commenter"),
  content: g.string().description("Content of the comment"),
  likedBy: g
    .ref(UserGQL)
    .list()
    .optional()
    .description("Users who liked the comment"),
});

export const queryType = g.type("Query", {
  getVenues: g.ref(VenueGQL).list().description("Retrieve a list of venues"),
  getUsers: g.ref(UserGQL).list().description("Retrieve a list of users"),
  getEvents: g.ref(EventGQL).list().description("Retrieve a list of events"),
  getComments: g
    .ref(CommentGQL)
    .list()
    .description("Retrieve a list of comments"),
});
