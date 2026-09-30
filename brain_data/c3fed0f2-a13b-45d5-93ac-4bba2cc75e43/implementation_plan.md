# Admin Financial Suite & Invoicing

Building a complete administrative ecosystem for managing revenue, tracking orders, and providing professional documentation to students.

## User Review Required

> [!IMPORTANT]
> **Data Compliance**: We need to add business address and Tax ID fields to the Tenant model to generate legally valid invoices.
> **PDF Aesthetics**: The invoices will automatically inherit the tenant's Primary Brand Color and Logo to maintain a premium, unified experience.

## Proposed Changes

### 1. Database & Models
- [MODIFY] **Tenant**: Add `address`, `support_email`, and `tax_id` fields.
- [MODIFY] **Order**: Add `invoice_number` for formal tracking.

---

### 2. Backend Engine (Modules/Orders)
- [NEW] **InvoiceService**: A dedicated service using `dompdf` to generate high-end PDF receipts.
- [NEW] **Admin/OrdersController**: High-performance API for managing the full transaction history across the tenant.
- [NEW] **Student/OrdersController**: API for students to retrieve their personal order history.

---

### 3. Admin Financial Dashboard (Frontend)
- [NEW] **Finance Page**: A specialized `/admin/finance` dashboard featuring:
    - **Transaction Table**: Advanced filtering (Status, Date, Item Type).
    - **PDF Generation**: Immediate download of student invoices.
    - **Revenue Breakdown**: Deeper charts showing course vs. membership revenue.

---

### 4. Student Order History (Frontend)
- [NEW] **Order History**: A clean `/student/orders` view where students can:
    - View all previous purchases.
    - Download formal PDF receipts.
    - Status tracking for successful/pending payments.

## Open Questions
1. **Financial Complexity**: Should we implement automatic Tax/VAT calculations based on the user's region, or just display a flat total for now?
2. **Refund Management**: Do you want admins to have a "Refund" button that triggers a Stripe refund, or just a manual "Cancel Order" flag?
3. **Receipt Delivery**: Should we automatically email the PDF invoice to the student upon successful purchase, or just keep it available for download?

## Verification Plan
### Automated Tests
- Test `InvoiceService` by mocking PDF output.
- Test Admin Order filtering logic with large datasets.
### Manual Verification
- Verify PDF visual quality (branding, logo integration).
- Verify secure access (ensure students can't download other students' invoices).
