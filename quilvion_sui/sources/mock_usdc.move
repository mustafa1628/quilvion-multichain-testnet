/// mock_usdc.move
/// Fake USDC for testnet testing.
/// Mimics Circle's USDC interface: module name `usdc`, struct name `USDC`.
/// Includes a shared Faucet so ANY wallet can mint test USDC freely.
/// DO NOT use on mainnet.
module usdc::usdc {
    use sui::coin;
    use sui::transfer;
    use sui::tx_context;

    public struct USDC has drop {}

    /// Shared faucet — anyone can call faucet_mint()
    public struct Faucet has key {
        id: UID,
        cap: coin::TreasuryCap<USDC>,
    }

    fun init(witness: USDC, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            6,
            b"USDC",
            b"USD Coin",
            b"Mock USDC for testnet testing",
            option::none(),
            ctx,
        );
        transfer::public_freeze_object(metadata);

        // Share faucet — anyone can mint, no private TreasuryCap needed
        transfer::share_object(Faucet {
            id: object::new(ctx),
            cap: treasury_cap,
        });
    }

    /// Anyone can call this — mints USDC to their wallet.
    /// Capped at 1000 USDC per call.
    public fun faucet_mint(
        faucet: &mut Faucet,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        let safe_amount = if (amount > 1_000_000_000) { 1_000_000_000 } else { amount };
        coin::mint_and_transfer(&mut faucet.cap, safe_amount, tx_context::sender(ctx), ctx);
    }

    /// Original admin mint — kept for compatibility
    public fun mint(
        cap: &mut coin::TreasuryCap<USDC>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        coin::mint_and_transfer(cap, amount, recipient, ctx);
    }
}
