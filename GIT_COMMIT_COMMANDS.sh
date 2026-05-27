#!/bin/bash
# Git commit commands for Quilvion merchant profile and product browsing features
# Run these commands in the terminal:

# First, verify you're in the right directory
# cd /workspaces/quilvion-multichain-testnet

# Stage all changes
git add -A

# Commit 1: Merchant Profile Page Implementation
git commit -m "feat: add dedicated merchant profile page with dashboard metrics

- Create /quilvion-sui-frontend/src/app/merchant/profile/page.tsx
- Display merchant score, revenue, orders, success rate, disputes
- Show recent orders with status indicators (COMPLETED, PENDING, DISPUTED)
- Include wallet information and network display
- Add back to dashboard navigation button
- Implement loading and empty states with proper UX
- Use consistent merchant theme colors (purple/indigo)"

# Commit 2: Merchant Stats API Integration  
git commit -m "feat: add merchant stats API integration and profile navigation

- Add fetchMerchantStats() utility function to /quilvion-sui-frontend/src/lib/api.ts
- Update /quilvion-sui-frontend/src/app/merchant/page.tsx
  - Add Profile navigation link in header
  - Show only for approved merchants (merchantStatus === 'approved')
  - Use purple/indigo styling consistent with merchant theme
- API calls /api/merchant/stats/{wallet_address} endpoint
- Returns merchant score, revenue, orders, disputes, success rate"

# Commit 3: Real Product Browsing from Database
git commit -m "feat: fetch real products from database for browse section

- Change initial products state from dummy PRODUCTS to empty array
- Implement proper product fetching on component mount
- Fetch from /api/buyer/products endpoint with category filtering
- Add productsLoading state for better loading indication
- Show spinner while fetching: 'Loading products...'
- Display empty state when no products match search/filter
- Remove fallback to dummy products on error
- Backend serves mock products if database is empty (for testing)
- Better error handling and state management"

# Commit 4: UI and UX Improvements
git commit -m "fix: improve product browsing UX with better loading states

- Add Loader2 icon import from lucide-react
- Implement loading spinner in product grid
- Add empty state card when no products found
- Improve error handling with proper logging
- Consistent styling with existing UI components
- Better user feedback during async operations"

# Finally, push all commits to GitHub
git push origin main

echo "✅ All commits pushed to GitHub!"
