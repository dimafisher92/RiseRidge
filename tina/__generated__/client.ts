import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '36967b0ae5c8c132e8c10d871c99725063a814ef', queries,  });
export default client;
  