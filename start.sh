#!/bin/bash
node backend/src/index.js &
BACKEND_PID=$!
echo "Backend started (PID $BACKEND_PID)"

sleep 1

cd frontend && npm run dev
