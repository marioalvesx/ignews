import { query as q } from "faunadb";
import { fauna } from "@/services/fauna";
import { stripe } from "@/services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscriptionId,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    await fauna.query(
      q.Create(q.Collection("subscriptions"), { data: subscription })
    );
  } else {
    await fauna.query(
      q.Update(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_id"), subscription.id))
        ),
        { data: { status: subscriptionData.status } }
      )
    );
  }
}
