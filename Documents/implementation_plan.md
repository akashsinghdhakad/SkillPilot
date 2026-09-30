# Implementation Plan: Phase 3 - Commerce & Licensing

This phase focuses on the financial and access control layer of SkillPilot, enabling course purchases and tenant subscription management.

## Proposed Changes

### 1. Orders Module
- **[NEW]** `Orders` Module
- **Schema**: `orders` (user_id, total, status, payment_status, tenant_id), `order_items` (order_id, course_id, price).
- **Controller**: `OrderController` for checkout and order history.

### 2. Payments Module
- **[NEW]** `Payments` Module
- **Schema**: `payments` (order_id, transaction_id, amount, provider, status).
- **Logics**: Placeholder for Stripe/PayPal integration.

### 3. Licenses & Packages Module
- **Finalize** `Licenses` and `Packages` logic.
- **Schema**: `packages` (name, price, user_limit, storage_limit), `licenses` (tenant_id, package_id, start_date, end_date, is_active).

---

## Verification Plan

### Automated Tests
- `php artisan route:list --path=api` to verify new commerce endpoints.
- Basic feature tests for order creation.

### Manual Verification
- Testing order flow using Postman/Bruno.
