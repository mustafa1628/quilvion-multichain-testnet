#!/bin/bash
# Kill any existing Python backend processes
pkill -9 -f "uvicorn\|main.py" || true
sleep 2

# Start the backend fresh
cd /workspaces/quilvion-multichain-testnet/quilvion-backend
python main.py
