# BACKEND RESTART INSTRUCTIONS

The backend must be **completely restarted** to apply changes.

## Step 1: Kill Old Process
```bash
# Kill ALL Python/Uvicorn processes
ps aux | grep -E "python|uvicorn" | grep -v grep
# Then kill by PID:
kill -9 <PID>

# OR use:
pkill -9 -f "python.*main.py"
pkill -9 -f "uvicorn"
```

## Step 2: Wait
```bash
sleep 3
```

## Step 3: Start Backend Fresh
```bash
cd /workspaces/quilvion-multichain-testnet/quilvion-backend
python main.py
```

## Step 4: Test Endpoint
```bash
curl -s http://localhost:8000/api/buyer/products | head -50
```

This should return JSON array with 3 mock products. If you see `<!DOCTYPE html>`, the backend isn't running or the endpoint doesn't exist.

## Debugging

### Check if backend is running:
```bash
ps aux | grep main.py
```

### Check if port 8000 is listening:
```bash
netstat -tlnp | grep 8000
# OR
lsof -i :8000
```

### Check for errors:
Look at the terminal output where `python main.py` is running for any error messages.
