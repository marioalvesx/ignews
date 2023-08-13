import Stripe from "stripe";
import { version } from "../../package.json";

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2023-08-11",
  appInfo: {
    name: "Ignews",
    version,
  },
});
