#!/bin/bash

# Quilvion Admin Configuration Update Script
# 
# Usage: ./update-config.sh <command> <value>
# Example: ./update-config.sh fee 300
#          ./update-config.sh daily-spend 2000
#          ./update-config.sh approval-threshold 1000
#          ./update-config.sh dispute-window 14
#          ./update-config.sh verification-expiry 2
#
# Requirements:
# - Sui CLI installed
# - Connected to Sui Testnet
# - Admin wallet active
# - Sufficient SUI for gas (~0.1 SUI)

set -e

# Configuration
PACKAGE_ID="0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4"
CONFIG_MANAGER="0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb"
ROLE_MANAGER="0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea"
GAS_BUDGET="10000000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Quilvion Protocol Configuration Update${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

verify_requirements() {
    print_header
    print_info "Verifying requirements..."
    
    # Check Sui CLI
    if ! command -v sui &> /dev/null; then
        print_error "Sui CLI not found. Please install Sui CLI first."
        exit 1
    fi
    print_success "Sui CLI found"
    
    # Check network
    NETWORK=$(sui client active-env 2>/dev/null || echo "")
    if [ "$NETWORK" != "testnet" ]; then
        print_warning "Not on Sui Testnet. Current: $NETWORK"
        print_info "Switch with: sui client switch --env testnet"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "Connected to Sui Testnet"
    fi
    
    # Check active wallet
    WALLET=$(sui client active-address 2>/dev/null)
    if [ -z "$WALLET" ]; then
        print_error "No active wallet. Please configure your Sui wallet."
        exit 1
    fi
    print_success "Active wallet: ${WALLET:0:10}...${WALLET: -4}"
    
    echo ""
}

# Conversion helpers
usdc_to_micro() {
    echo $((1 * 1000000))
}

days_to_seconds() {
    echo $(($1 * 86400))
}

years_to_seconds() {
    echo $(($1 * 31536000))
}

# Update functions
update_platform_fee() {
    local bps=$1
    
    if [ "$bps" -lt 0 ] || [ "$bps" -gt 10000 ]; then
        print_error "Basis points must be between 0 and 10,000"
        exit 1
    fi
    
    local percent=$(echo "scale=2; $bps / 100" | bc)
    
    print_info "Updating platform fee to $bps basis points ($percent%)"
    read -p "Confirm? (y/N) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Cancelled"
        exit 0
    fi
    
    echo "Executing transaction..."
    sui client call \
        --package "$PACKAGE_ID" \
        --module config_manager \
        --function set_platform_fee \
        --args "$CONFIG_MANAGER" "$bps" "$ROLE_MANAGER" \
        --gas-budget "$GAS_BUDGET"
    
    print_success "Platform fee updated to $percent%"
}

update_daily_spend_limit() {
    local usdc=$1
    local micro=$((usdc * 1000000))
    
    print_info "Updating daily spend limit to $usdc USDC per wallet"
    read -p "Confirm? (y/N) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Cancelled"
        exit 0
    fi
    
    echo "Executing transaction..."
    sui client call \
        --package "$PACKAGE_ID" \
        --module config_manager \
        --function set_daily_spend_limit \
        --args "$CONFIG_MANAGER" "$micro" "$ROLE_MANAGER" \
        --gas-budget "$GAS_BUDGET"
    
    print_success "Daily spend limit updated to $usdc USDC"
}

update_approval_threshold() {
    local usdc=$1
    local micro=$((usdc * 1000000))
    
    print_info "Updating admin approval threshold to $usdc USDC"
    read -p "Confirm? (y/N) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Cancelled"
        exit 0
    fi
    
    echo "Executing transaction..."
    sui client call \
        --package "$PACKAGE_ID" \
        --module config_manager \
        --function set_admin_approval_threshold \
        --args "$CONFIG_MANAGER" "$micro" "$ROLE_MANAGER" \
        --gas-budget "$GAS_BUDGET"
    
    print_success "Admin approval threshold updated to $usdc USDC"
}

update_dispute_window() {
    local days=$1
    local seconds=$((days * 86400))
    
    print_info "Updating dispute refund window to $days days"
    read -p "Confirm? (y/N) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Cancelled"
        exit 0
    fi
    
    echo "Executing transaction..."
    sui client call \
        --package "$PACKAGE_ID" \
        --module config_manager \
        --function set_refund_window \
        --args "$CONFIG_MANAGER" "$seconds" "$ROLE_MANAGER" \
        --gas-budget "$GAS_BUDGET"
    
    print_success "Dispute refund window updated to $days days ($seconds seconds)"
}

update_verification_expiry() {
    local years=$1
    local seconds=$((years * 31536000))
    
    print_info "Updating merchant verification expiry to $years year(s)"
    read -p "Confirm? (y/N) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Cancelled"
        exit 0
    fi
    
    echo "Executing transaction..."
    sui client call \
        --package "$PACKAGE_ID" \
        --module config_manager \
        --function set_verification_expiry \
        --args "$CONFIG_MANAGER" "$seconds" "$ROLE_MANAGER" \
        --gas-budget "$GAS_BUDGET"
    
    print_success "Verification expiry updated to $years year(s) ($seconds seconds)"
}

query_config() {
    print_info "Querying current configuration..."
    echo ""
    sui client object "$CONFIG_MANAGER"
}

show_presets() {
    echo ""
    echo "Available presets:"
    echo ""
    echo "Platform Fee:"
    echo "  low:      100 bps (1%)"
    echo "  standard: 250 bps (2.5%, default)"
    echo "  medium:   300 bps (3%)"
    echo "  high:     500 bps (5%)"
    echo ""
    echo "Daily Spend Limit (USDC):"
    echo "  conservative: 100"
    echo "  standard:     1000 (default)"
    echo "  generous:     5000"
    echo "  unlimited:    1000000"
    echo ""
    echo "Approval Threshold (USDC):"
    echo "  low:      100"
    echo "  standard: 500 (default)"
    echo "  medium:   1000"
    echo "  high:     5000"
    echo ""
    echo "Dispute Window (days):"
    echo "  short:    1"
    echo "  medium:   3"
    echo "  standard: 7 (default)"
    echo "  long:     14"
    echo "  extended: 30"
    echo ""
}

show_usage() {
    echo "Usage: $0 <command> [value]"
    echo ""
    echo "Commands:"
    echo "  fee <basis-points>              Update platform fee (e.g., 250 for 2.5%)"
    echo "  daily-spend <usdc>              Update daily spend limit (e.g., 1000)"
    echo "  approval-threshold <usdc>       Update approval threshold (e.g., 500)"
    echo "  dispute-window <days>           Update dispute window (e.g., 7)"
    echo "  verification-expiry <years>     Update verification expiry (e.g., 1)"
    echo "  query                           Query current configuration"
    echo "  presets                         Show available presets"
    echo "  help                            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 fee 300                      # Set fee to 3%"
    echo "  $0 daily-spend 2000             # Set daily limit to 2000 USDC"
    echo "  $0 approval-threshold 1000      # Set approval threshold to 1000 USDC"
    echo "  $0 dispute-window 14            # Set dispute window to 14 days"
    echo "  $0 verification-expiry 2        # Set verification expiry to 2 years"
    echo ""
}

# Main execution
if [ $# -eq 0 ]; then
    show_usage
    exit 1
fi

COMMAND=$1
VALUE=$2

case "$COMMAND" in
    fee)
        verify_requirements
        update_platform_fee "$VALUE"
        ;;
    daily-spend)
        verify_requirements
        update_daily_spend_limit "$VALUE"
        ;;
    approval-threshold)
        verify_requirements
        update_approval_threshold "$VALUE"
        ;;
    dispute-window)
        verify_requirements
        update_dispute_window "$VALUE"
        ;;
    verification-expiry)
        verify_requirements
        update_verification_expiry "$VALUE"
        ;;
    query)
        verify_requirements
        query_config
        ;;
    presets)
        show_presets
        ;;
    help)
        show_usage
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        show_usage
        exit 1
        ;;
esac
