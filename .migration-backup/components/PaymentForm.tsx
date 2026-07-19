'use client'

import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { StripeCardElement } from '@stripe/stripe-js'
import { Button } from "@/components/ui/button"

interface PaymentFormProps {
  onSuccess: () => void;  // Define the type for the onSuccess function
}

export function PaymentForm({ onSuccess }: PaymentFormProps) {  // Add the explicit type for onSuccess
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)  // Make sure error state accepts strings
  const [processing, setProcessing] = useState<boolean>(false)

  const handleSubmit = async (event: React.FormEvent) => {  // Define event type
    event.preventDefault()
    setProcessing(true)

    if (!stripe || !elements) {
      setProcessing(false)
      return
    }

    const cardElement = elements.getElement(CardElement) as StripeCardElement | null

    if (!cardElement) {  // Handle the null case for cardElement
      setError('Card element not found')
      setProcessing(false)
      return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (error) {
      setError(error.message || 'An error occurred')
      setProcessing(false)
    } else {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        setError('Payment failed. Please try again.')
      }
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
}
