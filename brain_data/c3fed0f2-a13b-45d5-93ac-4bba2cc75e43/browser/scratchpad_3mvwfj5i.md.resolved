# Task: Verify Checkout Flow

- [x] Navigate to http://localhost:3000/membership
- [x] Log in if needed
- [x] Select 'Silver Pass' (or any plan)
- [x] Verify '/checkout' page loads without build errors (Renders "Order not found" due to backend 500)
- [ ] Take a screenshot of the premium Order Summary (Blocked by backend 500)
- [x] Navigate to '/checkout/success'
- [x] Take a screenshot of the premium Success page
- [x] Navigate to '/checkout/cancel'
- [x] Take a screenshot of the Cancellation page

## Findings
- All membership plans (Bronze, Silver, Gold) correctly attempt to create an order and redirect to `/checkout?orderId={id}`.
- The checkout page correctly renders but displays "Order not found" because the backend call to `api/orders/{id}` returns a **500 Internal Server Error**.
- `/checkout/success` and `/checkout/cancel` pages were verified and screenshotted.
- The 500 error is likely related to the recent polymorphic order migration/update in the backend.
