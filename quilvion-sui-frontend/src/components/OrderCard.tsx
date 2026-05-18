'use client';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Clock, Loader2, ExternalLink, Check } from 'lucide-react';

interface Order {
  id: number;
  productName: string;
  amountUsdc: number;
  status: string;
  createdAt: string;
  txDigest?: string;
  merchantWallet?: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  COMPLETED:       { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  icon: CheckCircle,   label: 'Completed' },
  PENDING:         { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: Clock,         label: 'In Escrow' },
  DISPUTED:        { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: AlertTriangle, label: 'Disputed' },
  CANCELLED:       { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: Clock,         label: 'Cancelled' },
  ESCROW_RELEASED: { color: '#4DA2FF', bg: 'rgba(77,162,255,0.1)',  icon: CheckCircle,   label: 'Released' },
  REFUNDED:        { color: '#AB9FF2', bg: 'rgba(171,159,242,0.1)', icon: CheckCircle,   label: 'Refunded' },
};

export function OrderCard({ 
  order, 
  onDispute, 
  onRelease, 
  loading 
}: {
  order: Order;
  onDispute: () => void;
  onRelease?: (orderId: number) => void;
  loading: boolean;
}) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  const suiscanUrl = `https://suiscan.xyz/testnet/tx/${order.txDigest}`;

  return (
    <motion.div
      className="p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
      style={{ background: 'rgba(255,255,255,0.02)' }}
      whileHover={{ y: -1 }}>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-white/30">Order #{order.id}</span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: cfg.bg, color: cfg.color }}>
              <cfg.icon size={10} />
              {cfg.label}
            </span>
          </div>

          <h4 className="font-semibold text-white text-sm truncate">{order.productName}</h4>
          <p className="text-xs text-white/35 mt-0.5">{order.createdAt}</p>

          {order.txDigest && (
            <button
              onClick={() => window.open(suiscanUrl, '_blank')}
              className="inline-flex items-center gap-1 text-xs text-white/20 hover:text-blue-400 transition-colors mt-1">
              <ExternalLink size={10} />
              View on Suiscan
            </button>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <div className="font-black text-white text-sm">${order.amountUsdc}</div>
          <div className="text-xs text-white/30">USDC</div>
        </div>
      </div>

      {/* Actions for PENDING Orders */}
      {order.status === 'PENDING' && (
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onDispute}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-red-500/20 disabled:opacity-50"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
            Raise Dispute
          </button>

          {onRelease && (
            <button
              onClick={() => onRelease(order.id)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-emerald-600 disabled:opacity-50"
              style={{ 
                background: 'linear-gradient(135deg, #10b981, #34d399)', 
                color: '#fff',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              ✅ Release Escrow
            </button>
          )}
        </div>
      )}

      {/* Info text */}
      {order.status === 'PENDING' && (
        <div className="mt-3 text-[10px] text-white/40 flex items-center gap-1.5">
          <Shield size={11} className="text-yellow-400" />
          Funds are in escrow. Click "Release Escrow" after you receive the product.
        </div>
      )}
    </motion.div>
  );
}