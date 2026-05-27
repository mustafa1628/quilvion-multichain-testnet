#!/bin/bash

# Commit script for Quilvion multichain merchant & product browsing enhancements

echo "📝 Starting git commits for Quilvion enhancements..."

# Stage all changes
git add -A

# Commit 1: Merchant Profile Page
git commit -m "feat: add dedicated merchant profile page with stats and order history

- Create /merchant/profile/page.tsx with merchant stats display
- Show merchant score, revenue, orders, success rate, disputes
- Display recent orders with status indicators
- Add wallet information section
- Include back to dashboard navigation
- Implement proper loading and empty states"

# Commit 2: Merchant Stats API Integration
git commit -m "feat: integrate merchant stats API and add profile navigation

- Add fetchMerchantStats() function to api.ts for API calls
- Update merchant/page.tsx with Profile navigation link
- Show profile link only for approved merchants
- Use consistent purple/indigo styling for merchant theme
- Add conditional rendering based on merchant approval status"

# Commit 3: Product Browsing from Database
git commit -m "feat: display real products from database in browse section

- Change products state from dummy PRODUCTS to empty array
- Fetch real approved products from /api/buyer/products endpoint
- Add productsLoading state for better UX
- Show loading spinner while fetching products
- Display empty state when no products match search/filter
- Fix fallback behavior - no longer defaults to dummy products
- Backend automatically serves mock products if database is empty

BREAKING CHANGE: Browse section now requires database products
or relies on mock products from backend for testing"

# Commit 4: UI Improvements
git commit -m "fix: improve UI loading states and error handling

- Add Loader2 icon import from lucide-react
- Implement loading state in product grid
- Add empty state for no products found
- Improve error handling with proper state updates
- Better user feedback during data fetching"

echo "✅ All commits created!"
echo "📤 Ready to push with: git push origin main"
