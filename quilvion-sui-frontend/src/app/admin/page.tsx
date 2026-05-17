'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Package, Store, CheckCircle, XCircle,
  Clock, BarChart3, Eye, Trash2, RefreshCw, Lock
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── Admin auth ─────────────────────────────────────────────────────────────────
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'quilvion-admin-2025';

function useAdminApi() {
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-secret': ADMIN_SECRET,
  };

  const get = (path: string) =>
    fetch(`${API}/api/admin${path}`, { headers }).then(r => r.json());

  const patch = (path: string, body: object) =>
    fetch(`${API}/api/admin${path}`, {
      method: 'PATCH', headers,
      body: JSON.stringify(body),
    }).then(r => r.json());

  const del = (path: string) =>
    fetch(`${API}/api/admin${path}`, { method: 'DELETE', headers }).then(r => r.json());

  return { get, patch, del };
}

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config = {
    approved: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: '✓ Approved' },
    pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: '⏳ Pending' },
    rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: '✗ Rejected' },
  }[status] ?? { color: '#fff', bg: 'rgba(255,255,255,0.05)', label: status };

  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
      style={{ background: config.bg, color: config.color }}>
      {config.label}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [tab, setTab] = useState<'stats' | 'merchants' | 'products'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const api = useAdminApi();

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, m, p] = await Promise.all([
        api.get('/stats'),
        api.get('/merchants'),
        api.get('/products'),
      ]);
      setStats(s);
      setMerchants(m);
      setProducts(p);
    } catch {
      showToast('Failed to load data', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadAll();
  }, [authed]);

  const updateMerchant = async (id: number, status: string) => {
    await api.patch(`/merchants/${id}/status`, { status });
    showToast(`Merchant ${status}!`);
    loadAll();
  };

  const updateProduct = async (id: number, status: string) => {
    await api.patch(`/products/${id}/status`, { status });
    showToast(`Product ${status}!`);
    loadAll();
  };

  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await api.del(`/products/${id}`);
    showToast('Product deleted!');
    loadAll();
  };

  // ── Login screen ─────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#05050f' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 rounded-3xl border border-white/8"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Quilvion" className="w-9 h-9 rounded-xl object-contain" />
            <div>
              <h1 className="font-black text-white text-base">Admin Panel</h1>
              <p className="text-xs text-white/35">Quilvion · Restricted Access</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                value={secretInput}
                onChange={e => setSecretInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setAuthed(secretInput === ADMIN_SECRET)}
                placeholder="Admin secret key"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-white/8 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#fff' }}
              />
            </div>
            <button
              onClick={() => {
                if (secretInput === ADMIN_SECRET) setAuthed(true);
                else alert('Wrong secret key');
              }}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#4DA2FF,#6366f1)' }}>
              Enter Admin Panel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#05050f', color: '#fff' }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl border text-sm font-semibold"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
            style={{
              background: toast.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              borderColor: toast.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
              color: toast.ok ? '#10b981' : '#ef4444',
            }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl"
        style={{ background: 'rgba(5,5,15,0.9)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Quilvion" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-black text-sm">
              Quilvion <span className="text-white/30 font-normal">· Admin</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-white/5"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            {[
              { id: 'stats',     icon: BarChart3, label: 'Overview' },
              { id: 'merchants', icon: Store,     label: `Merchants${stats ? ` (${stats.merchants.pending})` : ''}` },
              { id: 'products',  icon: Package,   label: `Products${stats ? ` (${stats.products.pending})` : ''}` },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: tab === t.id ? 'rgba(77,162,255,0.15)' : 'transparent',
                  color: tab === t.id ? '#4DA2FF' : 'rgba(255,255,255,0.4)',
                }}>
                <t.icon size={13} />
                {t.label}
              </button>
            ))}
          </div>

          <button onClick={loadAll} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* ── STATS TAB ── */}
        {tab === 'stats' && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-xl font-black">Platform Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Merchants', value: stats.merchants.total, color: '#4DA2FF', icon: Store },
                { label: 'Pending Merchants', value: stats.merchants.pending, color: '#f59e0b', icon: Clock },
                { label: 'Total Products', value: stats.products.total, color: '#AB9FF2', icon: Package },
                { label: 'Pending Products', value: stats.products.pending, color: '#f59e0b', icon: Clock },
                { label: 'Approved Merchants', value: stats.merchants.approved, color: '#10b981', icon: CheckCircle },
                { label: 'Approved Products', value: stats.products.approved, color: '#10b981', icon: CheckCircle },
                { label: 'Rejected Products', value: stats.products.rejected, color: '#ef4444', icon: XCircle },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-2xl border border-white/5"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <s.icon size={14} style={{ color: s.color }} className="mb-2" />
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Quick pending alerts */}
            {(stats.merchants.pending > 0 || stats.products.pending > 0) && (
              <div className="p-4 rounded-2xl border border-yellow-400/20"
                style={{ background: 'rgba(245,158,11,0.06)' }}>
                <p className="text-sm text-yellow-300/80 font-semibold mb-2">⚠ Pending Reviews</p>
                <div className="flex gap-4 text-xs text-yellow-300/60">
                  {stats.merchants.pending > 0 && (
                    <button onClick={() => setTab('merchants')} className="hover:text-yellow-300 transition-colors">
                      {stats.merchants.pending} merchant{stats.merchants.pending > 1 ? 's' : ''} waiting →
                    </button>
                  )}
                  {stats.products.pending > 0 && (
                    <button onClick={() => setTab('products')} className="hover:text-yellow-300 transition-colors">
                      {stats.products.pending} product{stats.products.pending > 1 ? 's' : ''} waiting →
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── MERCHANTS TAB ── */}
        {tab === 'merchants' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-black">Merchants
              <span className="ml-2 text-sm font-normal text-white/30">({merchants.length} total)</span>
            </h2>

            {merchants.length === 0 ? (
              <div className="text-center py-16 text-white/25">
                <Store size={36} className="mx-auto mb-3 opacity-30" />
                <p>No merchants yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {merchants.map((m, i) => (
                  <motion.div key={m.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white">{m.company_name}</h3>
                          <StatusBadge status={m.status} />
                        </div>
                        <p className="text-xs text-white/40 mb-1">{m.category} · {m.contact_email}</p>
                        <p className="text-xs text-white/30 font-mono truncate">{m.wallet_address}</p>
                        <p className="text-xs text-white/40 mt-2 line-clamp-2">{m.description}</p>
                        <p className="text-xs text-white/20 mt-1">{m.created_at?.split('T')[0]}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {m.status !== 'approved' && (
                          <button onClick={() => updateMerchant(m.id, 'approved')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                            <CheckCircle size={12} /> Approve
                          </button>
                        )}
                        {m.status !== 'rejected' && (
                          <button onClick={() => updateMerchant(m.id, 'rejected')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                            <XCircle size={12} /> Reject
                          </button>
                        )}
                        {m.status !== 'pending' && (
                          <button onClick={() => updateMerchant(m.id, 'pending')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                            <Clock size={12} /> Pending
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-black">Products
              <span className="ml-2 text-sm font-normal text-white/30">({products.length} total)</span>
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-16 text-white/25">
                <Package size={36} className="mx-auto mb-3 opacity-30" />
                <p>No products yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>

                    <div className="flex items-start gap-4">
                      {/* Image / Emoji */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        {p.images && p.images.length > 0 && p.images[0]
                          ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          : p.emoji
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white">{p.name}</h3>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="text-xs text-white/40 mb-1">
                          {p.category} · <span className="font-bold text-white">${p.price_usdc} USDC</span>
                        </p>
                        <p className="text-xs text-white/35">
                          by <span className="text-white/60">{p.merchant_name}</span>
                        </p>
                        <p className="text-xs text-white/30 mt-1.5 line-clamp-2">{p.description}</p>

                        {/* Tags */}
                        {p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.tags.slice(0, 3).map((tag: string) => (
                              <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(77,162,255,0.08)', color: '#4DA2FF' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-white/20 mt-2">{p.created_at?.split('T')[0]}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {p.status !== 'approved' && (
                          <button onClick={() => updateProduct(p.id, 'approved')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                            <CheckCircle size={12} /> Approve
                          </button>
                        )}
                        {p.status !== 'rejected' && (
                          <button onClick={() => updateProduct(p.id, 'rejected')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                            <XCircle size={12} /> Reject
                          </button>
                        )}
                        {p.status !== 'pending' && (
                          <button onClick={() => updateProduct(p.id, 'pending')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                            <Clock size={12} /> Pending
                          </button>
                        )}
                        <button onClick={() => deleteProduct(p.id, p.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                          style={{ background: 'rgba(239,68,68,0.06)', color: 'rgba(239,68,68,0.6)' }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}