---
'@aspect/finance': minor
---

add 6 finance components for nagara-finance (Wave 4):

- **CurrencyInput** — NumberInput preset with locale-aware currency symbol prefix and 2-decimal precision default
- **TaxRateInput** — NumberInput preset with % suffix and 0-100 clamp
- **InvoiceLineItem** — single-row line item composing description/qty/unit price/tax/computed total with inline remove
- **LedgerRow** — debit/credit/balance row with negative balance styling and subtotal variant
- **ChartOfAccounts** — recursive tree of accounts with code/name/type/balance and 4-level depth indent
- **ReconciliationRow** — bank match row with matched/unmatched/disputed/pending status and optional match reference
