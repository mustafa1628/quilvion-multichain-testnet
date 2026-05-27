#!/bin/bash
# Quilvion Multichain - Automated Commit Script
# This script commits all changes organized by module

set -e  # Exit on error

cd /workspaces/quilvion-multichain-testnet

echo "🚀 Starting automated commit process..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# 1. Aptos Module
echo "📦 [1/8] Committing Aptos Commerce Core Module..."
if [ -d "quilvion_aptos" ]; then
    git add quilvion_aptos/
    git commit -m "feat(aptos): Add Aptos commerce core module with Move smart contracts

- Commerce core contract with order management
- Configuration manager for system settings
- Escrow logic for secure transactions
- Reputation manager for merchant/buyer tracking
- Role-based access control
- Event logging system
- Comprehensive test suite" 2>/dev/null && echo "✅ Aptos committed" || echo "⏭️  Skipped (no changes)"
else
    echo "⚠️  Aptos module not found"
fi

# 2. EVM Contracts
echo ""
echo "📦 [2/8] Committing EVM Smart Contracts..."
if [ -d "quilvion_evm" ]; then
    git add quilvion_evm/
    git commit -m "feat(evm): Add EVM smart contracts using Hardhat

- CommerceCore contract for order management
- ConfigManager for contract configuration
- EscrowLogic for secure fund handling
- ReputationManager for user ratings
- MockUSDC token for testing
- Deployment scripts for EVM networks
- Test suite for all contracts" 2>/dev/null && echo "✅ EVM committed" || echo "⏭️  Skipped (no changes)"
else
    echo "⚠️  EVM module not found"
fi

# 3. Solana Program
echo ""
echo "📦 [3/8] Committing Solana Commerce Program..."
if [ -d "quilvion_solana" ]; then
    git add quilvion_solana/
    git commit -m "feat(solana): Add Solana commerce program with Anchor framework

- Commerce core program implementation
- Client SDK in TypeScript
- Deployment configuration
- Integration tests
- Cargo configuration for Rust dependencies" 2>/dev/null && echo "✅ Solana committed" || echo "⏭️  Skipped (no changes)"
else
    echo "⚠️  Solana module not found"
fi

# 4. Sui Module
echo ""
echo "📦 [4/8] Committing Sui Commerce Module..."
if [ -d "quilvion_sui" ]; then
    git add quilvion_sui/
    git commit -m "feat(sui): Add Sui Move modules for commerce platform

- Commerce core with order management
- Config manager for system parameters
- Escrow logic for transactions
- Reputation system implementation
- Access control module
- Mock USDC token contract
- Comprehensive test suite
- Deployment scripts" 2>/dev/null && echo "✅ Sui committed" || echo "⏭️  Skipped (no changes)"
else
    echo "⚠️  Sui module not found"
fi

# 5. Backend
echo ""
echo "📦 [5/8] Committing Python Backend..."
if [ -d "quilvion-backend" ]; then
    git add quilvion-backend/
    git commit -m "feat(backend): Add Python backend with FastAPI

- Core database schema and migrations
- LLM integration with Claude client
- ML model for risk assessment
- API routes for admin operations
- Buyer and merchant endpoints
- Order management system
- Dispute resolution module
- Risk assessment endpoints
- Requirements.txt with dependencies" 2>/dev/null && echo "✅ Backend committed" || echo "⏭️  Skipped (no changes)"
else
    echo "⚠️  Backend not found"
fi

# 6. Main Frontend
echo ""
echo "📦 [6/8] Committing Main Web3 Frontend..."
if [ -d "quilvion-frontend" ]; then
    git add quilvion-frontend/
    git commit -m "feat(frontend): Add main Web3 marketplace frontend with Next.js

- Next.js 13+ with TypeScript
- ESLint configuration
- PostCSS and styling setup
- Public assets
- Main marketplace page
- Documentation pages
- Privacy policy page
- Terms of service page
- pnpm workspace configuration" 2>/dev/null && echo "✅ Frontend committed" || echo "⏭️  Skipped (no changes)"
else
    echo "⚠️  Frontend not found"
fi

# 7. Sui Frontend
echo ""
echo "📦 [7/8] Committing Sui-Specific Frontend..."
if [ -d "quilvion-sui-frontend" ]; then
    git add quilvion-sui-frontend/
    git commit -m "feat(sui-frontend): Add Sui blockchain specific frontend

- Next.js application for Sui platform
- Buyer chat interface component
- Buy modal component
- Merchant onboarding interface
- Admin dashboard
- Merchant dashboard
- TypeScript support
- Tailwind CSS configuration
- API integration layer" 2>/dev/null && echo "✅ Sui Frontend committed" || echo "⏭️  Skipped (no changes)"
else
    echo "⚠️  Sui Frontend not found"
fi

# 8. Documentation & Root Config
echo ""
echo "📦 [8/8] Committing Documentation & Configuration..."
git add AI-Skill.md LICENSE README.md COMMIT_STRATEGY.md 2>/dev/null
git commit -m "docs: Add project documentation and licensing

- Main README with project overview
- AI skill documentation
- LICENSE file
- Commit strategy guide" 2>/dev/null && echo "✅ Documentation committed" || echo "⏭️  Skipped (no changes)"

# Show commit log
echo ""
echo "📊 Recent commits:"
git log --oneline -8

echo ""
echo "✨ All commits completed!"
echo "🚀 Ready to push? Run: git push origin main"
