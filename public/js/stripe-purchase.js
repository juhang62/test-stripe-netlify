export async function handleFormSubmission(event) {
    event.preventDefault();
    const form = new FormData(event.target);
  
    const data = {
      name: form.get('name'),
      quantity: Number(form.get('quantity')),
    };
    //debugger
    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  
    const stripe = Stripe(response.publishableKey);
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.sessionId,
    });
  
    if (error) {
      console.error(error);
    }
  }