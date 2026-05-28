# Admin Configuration Quick Start

## Overview

Admins can update Quilvion protocol parameters directly on-chain using either:

1. **Sui CLI** — for command-line configuration updates
2. **TypeScript Helper** — programmatic transaction building (frontend/dApps)
3. **Admin Dashboard** — GUI-based interface (coming soon)

---

## Method 1: Sui CLI (Command Line)

### Setup

```bash
# Ensure you're on Sui Testnet
sui client switch --env testnet

# Verify your wallet has admin role
sui client active-address
```

### Update Platform Fee

```bash
# Set to 3% (300 basis points)
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_platform_fee \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    300 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Update Daily Spend Limit

```bash
# Set to 2,000 USDC per day
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_daily_spend_limit \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    2000000000 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Update Approval Threshold

```bash
# Set to 1,000 USDC (orders > 1000 USDC need admin release)
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_admin_approval_threshold \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    1000000000 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Update Dispute Window

```bash
# Set to 14 days
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_refund_window \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    1209600 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

---

## Method 2: TypeScript Helper (Programmatic)

### Import & Usage

```typescript
import { Transaction } from '@mysten/sui/transactions';
import {
  buildSetPlatformFee,
  buildSetDailySpendLimit,
  buildSetAdminApprovalThreshold,
  buildSetRefundWindow,
  buildSetVerificationExpiry,
  CONFIG_PRESETS,
} from '@/lib/sui/configTransactions';

// Example: Update platform fee using preset
const tx = new Transaction();
buildSetPlatformFee(tx, CONFIG_PRESETS.platformFee.MEDIUM); // 3%

// Execute with your signer
const result = await signAndExecuteTransaction({ transaction: tx });
```

### Common Update Patterns

```typescript
import { Transaction } from '@mysten/sui/transactions';
import {
  buildSetPlatformFee,
  buildSetDailySpendLimit,
  buildSetAdminApprovalThreshold,
  buildSetRefundWindow,
  CONFIG_PRESETS,
  usdcToMicro,
  daysToSeconds,
} from '@/lib/sui/configTransactions';

// Pattern 1: Update with preset
const tx1 = new Transaction();
buildSetPlatformFee(tx1, CONFIG_PRESETS.platformFee.HIGH); // 5%

// Pattern 2: Update with custom value
const tx2 = new Transaction();
buildSetDailySpendLimit(tx2, usdcToMicro(2500)); // 2,500 USDC per day

// Pattern 3: Update time-based config
const tx3 = new Transaction();
buildSetRefundWindow(tx3, daysToSeconds(14)); // 14 days

// Pattern 4: Multiple updates in sequence
const tx4 = new Transaction();
buildSetPlatformFee(tx4, CONFIG_PRESETS.platformFee.STANDARD); // 2.5%
buildSetDailySpendLimit(tx4, usdcToMicro(1000));
buildSetAdminApprovalThreshold(tx4, usdcToMicro(500));
```

### React Component Example

```typescript
'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import {
  buildSetPlatformFee,
  CONFIG_PRESETS,
  describeConfig,
} from '@/lib/sui/configTransactions';

export function PlatformFeeUpdater() {
  const [newFee, setNewFee] = useState<number>(CONFIG_PRESETS.platformFee.STANDARD);
  const [loading, setLoading] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const tx = new Transaction();
      buildSetPlatformFee(tx, newFee);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Fee updated:', result.digest);
            alert(`Platform fee updated to ${describeConfig('platformFee', newFee)}`);
          },
          onError: (err) => {
            alert(`Error: ${err.message}`);
          },
          onSettled: () => setLoading(false),
        }
      );
    } catch (err) {
      alert(`Failed: ${err}`);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-white/2">
      <h3 className="font-bold text-white mb-4">Update Platform Fee</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/40 block mb-2">Basis Points</label>
          <input
            type="number"
            value={newFee}
            onChange={(e) => setNewFee(Number(e.target.value))}
            min="0"
            max="10000"
            className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white"
          />
          <p className="text-xs text-white/30 mt-1">
            Current: {describeConfig('platformFee', newFee)}
          </p>
        </div>
        <div className="flex gap-2">
          {Object.entries(CONFIG_PRESETS.platformFee).map(([name, value]) => (
            <button
              key={name}
              onClick={() => setNewFee(value)}
              className="flex-1 py-2 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
            >
              {name}
            </button>
          ))}
        </div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Fee'}
        </button>
      </div>
    </div>
  );
}
```

---

## Reference: Conversion Utilities

```typescript
import {
  usdcToMicro,      // 1 → 1,000,000
  microToUsdc,      // 1,000,000 → 1
  daysToSeconds,    // 1 → 86,400
  secondsToDays,    // 86,400 → 1
} from '@/lib/sui/configTransactions';

// USDC conversions
usdcToMicro(500);    // → 500,000,000
microToUsdc(500_000_000); // → 500

// Time conversions
daysToSeconds(7);    // → 604,800
secondsToDays(604800); // → 7
```

---

## Configuration Presets

```typescript
CONFIG_PRESETS.platformFee = {
  LOW: 100,          // 1%
  STANDARD: 250,     // 2.5% (default)
  MEDIUM: 300,       // 3%
  HIGH: 500,         // 5%
};

CONFIG_PRESETS.dailySpendLimit = {
  CONSERVATIVE: 100_000_000,      // 100 USDC
  STANDARD: 1_000_000_000,        // 1,000 USDC (default)
  GENEROUS: 5_000_000_000,        // 5,000 USDC
  UNLIMITED: 1_000_000_000_000,   // 1,000,000 USDC
};

CONFIG_PRESETS.approvalThreshold = {
  LOW: 100_000_000,       // 100 USDC
  STANDARD: 500_000_000,  // 500 USDC (default)
  MEDIUM: 1_000_000_000,  // 1,000 USDC
  HIGH: 5_000_000_000,    // 5,000 USDC
};

CONFIG_PRESETS.refundWindow = {
  SHORT: 86_400,          // 1 day
  MEDIUM: 259_200,        // 3 days
  STANDARD: 604_800,      // 7 days (default)
  LONG: 1_209_600,        // 14 days
  EXTENDED: 2_592_000,    // 30 days
};

CONFIG_PRESETS.verificationExpiry = {
  SIX_MONTHS: 15_768_000,   // 6 months
  ONE_YEAR: 31_536_000,     // 1 year (default)
  TWO_YEARS: 63_072_000,    // 2 years
  THREE_YEARS: 94_608_000,  // 3 years
};
```

---

## Verification After Update

### Check Transaction

```bash
# View transaction details
sui client transaction <TX_DIGEST>

# View on explorer
# https://suiscan.xyz/testnet/tx/<TX_DIGEST>
```

### Query Current Config

```bash
# View ConfigManager object
sui client object 0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb
```

### Via Backend API

```bash
curl -H "x-admin-secret: quilvion-admin-2025" \
  http://localhost:8000/api/admin/config
```

---

## File References

- **On-Chain Update Guide:** [CONFIG_UPDATE_GUIDE.md](./CONFIG_UPDATE_GUIDE.md)
- **TypeScript Helper:** [src/lib/sui/configTransactions.ts](./quilvion-sui-frontend/src/lib/sui/configTransactions.ts)
- **Protocol Documentation:** [quilvion_sui/README.md](./quilvion_sui/README.md)

---

*Last Updated: May 28, 2026*
