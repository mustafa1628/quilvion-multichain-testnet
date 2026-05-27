# Complete Debugging Guide - API Not Responding

## 🔴 The Problem
```
SyntaxError: Unexpected token '<', "<!DOCTYPE"...
```
= **Backend returning HTML instead of JSON**
= **Endpoint `/api/buyer/products` is either missing or the backend isn't running**

---

## ✅ Step 1: Kill Backend Completely

Open terminal and run:

```bash
# Method 1: Kill by process name (most reliable)
pkill -9 -f "python.*main.py"
pkill -9 -f "uvicorn"
sleep 3

# Method 2: Check if killed
ps aux | grep -E "python|uvicorn" | grep -v grep
# Should return nothing (empty)

# Method 3: If still running, find PID manually
ps aux | grep main.py
# Kill by PID: kill -9 <PID>
```

---

## ✅ Step 2: Verify Port is Free

```bash
# Check if port 8000 is still in use
lsof -i :8000
# OR
netstat -tlnp | grep 8000

# If still in use, kill the process:
# lsof -ti :8000 | xargs kill -9
```

---

## ✅ Step 3: Start Backend Fresh

```bash
cd /workspaces/quilvion-multichain-testnet/quilvion-backend

# Run with explicit Python path
python main.py
```

**Wait for these exact messages:**
```
✅ ML model loaded
INFO:     Uvicorn running on http://0.0.0.0:8000
```

If you see errors instead, **COPY THE FULL ERROR** and share it.

---

## ✅ Step 4: Test Endpoint Directly

**In a NEW terminal** (don't close the backend terminal):

```bash
# Test the products endpoint
curl -s http://localhost:8000/api/buyer/products | jq .

# Should return JSON array like:
# [
#   {
#     "id": 1,
#     "name": "Complete Web3 Development Bootcamp",
#     ...
#   },
#   ...
# ]
```

### If you get HTML (404 error):
```bash
curl -s http://localhost:8000/api/buyer/products | head -5
# Will show: <!DOCTYPE html> or similar
# = ENDPOINT NOT FOUND
```

### If you get connection refused:
```bash
# Backend isn't listening on port 8000
# Make sure backend terminal shows "Uvicorn running on..."
```

---

## ✅ Step 5: Test in Browser Console

Open browser DevTools (F12 → Console) and run:

```javascript
// Test the API
fetch('http://localhost:8000/api/buyer/products')
  .then(r => r.json())
  .then(d => console.log('Got:', d))
  .catch(e => console.error('Error:', e))
```

---

## ✅ Step 6: Check Frontend Logs

Open browser DevTools (F12 → Console) and look for:

```
[fetchProducts] Calling: http://localhost:8000/api/buyer/products
[fetchProducts] Response status: 200
[fetchProducts] Got data: 3 products
```

### If you see status 404:
- Endpoint doesn't exist
- Backend has old code
- Restart backend and try again

### If you see "connection refused":
- Backend isn't running
- Go back to Step 3

---

## 📋 Checklist

- [ ] Killed all Python/Uvicorn processes (`ps aux | grep python` returns nothing)
- [ ] Port 8000 is free (`lsof -i :8000` returns nothing)
- [ ] Backend started with `python main.py`
- [ ] See "Uvicorn running on http://0.0.0.0:8000" in terminal
- [ ] `curl http://localhost:8000/api/buyer/products` returns JSON (not HTML)
- [ ] Frontend console shows `[fetchProducts] Response status: 200`
- [ ] Products appear in dashboard

---

## 🆘 Still Not Working?

Share output of:
1. `curl -s http://localhost:8000/api/buyer/products | head -20`
2. Backend terminal output (last 20 lines)
3. Browser console log (screenshot of `[fetchProducts]` messages)
