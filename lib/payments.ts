import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getEnvBool } from "@/lib/utils";
import { trackEvent, EVENTS } from "@/lib/analytics";

export function isMockPaymentsEnabled(): boolean {
  return (
    getEnvBool("ENABLE_MOCK_PAYMENTS", true) ||
    !process.env.STRIPE_SECRET_KEY
  );
}

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function createCheckoutSession(userId: string, email: string) {
  await trackEvent(EVENTS.CHECKOUT_STARTED, { userId });

  if (isMockPaymentsEnabled()) {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: "PRO" },
    });
    const existing = await prisma.subscription.findFirst({ where: { userId } });
    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: { plan: "PRO", status: "active" },
      });
    } else {
      await prisma.subscription.create({
        data: { userId, plan: "PRO", status: "active" },
      });
    }
    await trackEvent(EVENTS.PRO_UNLOCKED, { userId, properties: { mode: "mock" } });
    return { url: `${process.env.APP_URL ?? "http://localhost:3000"}/dashboard?upgraded=true` };
  }

  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe not configured");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  let customerId = user?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({ email, metadata: { userId } });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY;
  if (!priceId) throw new Error("Stripe price not configured");

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.APP_URL}/pricing?canceled=true`,
    metadata: { userId },
  });

  return { url: session.url! };
}

export async function handleStripeWebhook(body: string, signature: string) {
  const stripe = getStripe();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhook not configured");
  }

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: "PRO" },
      });
      await trackEvent(EVENTS.PRO_UNLOCKED, { userId, properties: { mode: "stripe" } });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
    if (user) {
      const isActive = sub.status === "active";
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: isActive ? "PRO" : "FREE" },
      });
    }
  }

  return { received: true };
}

export function isProUser(subscriptionStatus: string, reportProUnlocked?: boolean): boolean {
  return subscriptionStatus === "PRO" || subscriptionStatus === "EXECUTIVE" || !!reportProUnlocked;
}
