#!/bin/bash

echo "🚀 Starting Social Garden SOW Generator..."
echo ""

# Start PDF Service
echo "📄 Starting PDF Service on port 8000..."
cd /root/the11/pdf-service
nohup python3 main.py > /tmp/pdf-service.log 2>&1 &
PDF_PID=$!
echo "   ✅ PDF Service started (PID: $PDF_PID)"

sleep 2

# Start Next.js Dev Server (main app)
echo "⚡ Starting Next.js on 0.0.0.0:3005..."
cd /root/the11/novel-editor-demo/apps/web
pnpm dev --port 3005 > /tmp/nextjs.log 2>&1 &
NEXT_PID=$!
echo "   ✅ Next.js started (PID: $NEXT_PID)"

sleep 3

echo ""
echo "✅ All services started!"
echo ""
echo "📍 Access your app at:"
echo "   🌐 http://168.231.115.219:3005"
echo ""
echo "📋 Logs:"
echo "   Next.js: tail -f /tmp/nextjs.log"
echo "   PDF Service: tail -f /tmp/pdf-service.log"
echo ""
echo "⏳ Wait 10-15 seconds for compilation..."
echo ""
echo "🛑 To stop:"
echo "   kill $NEXT_PID $PDF_PID"
echo "   Or use: pkill -f 'PORT=3005' && pkill -f 'pdf-service/main.py'"
