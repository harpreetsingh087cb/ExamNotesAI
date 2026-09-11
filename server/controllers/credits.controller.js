import Stripe from "stripe"
import UserModel from "../models/user.model.js";
import dotenv from "dotenv"
dotenv.config()

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const CREDIT_MAP = {
  100: 50,
  200: 120,
  500: 300,
};

export const createCreditsOrder = async (req, res) => {
    try {
        const stripe = getStripe();
        if (!stripe) {
            return res.status(500).json({ message: "Stripe payments are not configured on the server." });
        }

        const userId = req.userId;
        const { amount } = req.body;

        if (!CREDIT_MAP[amount]) {
            return res.status(400).json({
                message: "Invalid credit plan",
            });
        }

        const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            success_url: `${clientUrl}/payment-success`,
            cancel_url: `${clientUrl}/payment-failed`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${CREDIT_MAP[amount]} Credits`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        credits: CREDIT_MAP[amount],
      },
    })

    res.status(200).json({ url: session.url });
    } catch (error) {
         res.status(500).json({ message: "Stripe error" });
    }
}


export const stripeWebhook = async (req,res) => {
    const sig = req.headers["stripe-signature"]
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )   
    } catch (error) {
         console.log("❌ Webhook signature error:", error.message);
    return res.status(400).send("Webhook Error");
    }

  if(event.type === "checkout.session.completed"){
    const session = event.data.object;

    const userId = session.metadata.userId;
    const creditsToAdd = Number(session.metadata.credits);

    if (!userId || !creditsToAdd) {
    return res.status(400).json({ message: "Invalid metadata" });
  }

  const user = await UserModel.findByIdAndUpdate(userId , {
    $inc: { credits: creditsToAdd },
      $set: { isCreditAvailable: true },
  },{new:true})

  }

   res.json({ received: true });
}