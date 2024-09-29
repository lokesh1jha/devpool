import Error from 'next/error'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  const { paymentMethodId } = await req.json()

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // $50.00 in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: Error | any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}