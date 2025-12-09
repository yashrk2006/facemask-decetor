#!/usr/bin/env python3
"""
Simple HTTP Server for Face Mask Detector Web Demo
Run this to serve the demo on localhost:3000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 3000
HOST = "localhost"

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for camera access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom logging
        print(f"[{self.log_date_time_string()}] {format % args}")

def run_server():
    # Change to web_demo directory
    web_demo_dir = Path(__file__).parent
    os.chdir(web_demo_dir)
    
    print("="*60)
    print("🎭 Face Mask Detector - Web Demo Server")
    print("="*60)
    print(f"\n✅ Server starting on http://{HOST}:{PORT}/")
    print(f"📁 Serving files from: {web_demo_dir}")
    print("\n🌐 Opening browser...")
    print("\n⚠️  To stop server: Press Ctrl+C")
    print("="*60)
    print()
    
    # Create server
    with socketserver.TCPServer((HOST, PORT), MyHandler) as httpd:
        # Open browser
        url = f"http://{HOST}:{PORT}/index.html"
        webbrowser.open(url)
        
        print(f"✓ Browser opened at: {url}")
        print(f"✓ Server is running...")
        print(f"\n📱 Click 'Start Camera' on the page to test!\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped by user")
            print("="*60)
            httpd.shutdown()

if __name__ == "__main__":
    try:
        run_server()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"\n❌ Error: Port {PORT} is already in use!")
            print(f"💡 Try closing other applications or use a different port")
            print(f"   Edit this file and change PORT = {PORT} to another number\n")
        else:
            print(f"\n❌ Error: {e}\n")
