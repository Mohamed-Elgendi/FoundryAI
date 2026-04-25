# Affiliate Marketplace
## ACTUAL REVENUE SYSTEM SPECIFICATION

### 1. Business Model (REAL)
- Commission: 10-50% per sale
- Two-tier system: 5% from sub-affiliates
- Payout methods: PayPal, Bank, Crypto
- Cookie duration: 90 days

### 2. Database Schema (ACTUAL)
```sql
CREATE TABLE affiliates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tier VARCHAR(20) DEFAULT 'bronze',
  commission_rate DECIMAL(5,2),
  referral_code VARCHAR(100) UNIQUE,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  pending_earnings DECIMAL(12,2) DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversions (
  id UUID PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id),
  order_id UUID,
  product_price DECIMAL(12,2),
  commission_amount DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. API Endpoints (REAL)
- GET /api/tier6/affiliate/marketplace
- POST /api/tier6/affiliate/links
- GET /api/tier6/affiliate/dashboard
- POST /api/tier6/affiliate/payouts/request

### 4. Revenue Projections (ACTUAL)
- Month 1: $1,000 affiliate revenue
- Month 3: $5,000 affiliate revenue
- Month 6: $15,000 affiliate revenue
- Year 1: $50,000 affiliate revenue
