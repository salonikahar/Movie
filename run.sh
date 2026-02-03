#!/bin/bash

echo "Starting BookMyScreen Project..."
echo ""

echo "Starting Server..."
cd server
npm run server &
SERVER_PID=$!
cd ..

sleep 3

echo "Starting Client..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo ""
echo "Both server and client are starting..."
echo "Server: http://localhost:3000"
echo "Client: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait

