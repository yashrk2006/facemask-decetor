#!/usr/bin/env python3
"""
HTTPS Server for Face Mask Detector
This solves camera permission issues on localhost
"""

import http.server
import ssl
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 3443  # HTTPS port
HOST = "localhost"

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

def create_self_signed_cert():
    """Create self-signed certificate for HTTPS"""
    try:
        # Check if OpenSSL is available
        import subprocess
        
        cert_file = 'cert.pem'
        key_file = 'key.pem'
        
        if os.path.exists(cert_file) and os.path.exists(key_file):
            print("✓ SSL certificates already exist")
            return cert_file, key_file
        
        print("Generating self-signed SSL certificate...")
        
        # Generate certificate
        subprocess.run([
            'openssl', 'req', '-new', '-x509', '-keyout', key_file,
            '-out', cert_file, '-days', '365', '-nodes',
            '-subj', '/CN=localhost'
        ], check=True, capture_output=True)
        
        print("✓ SSL certificates generated")
        return cert_file, key_file
        
    except Exception as e:
        print(f"⚠️ Could not generate certificates: {e}")
        print("Using HTTP instead (may have camera permission issues)")
        return None, None

def run_https_server():
    web_demo_dir = Path(__file__).parent
    os.chdir(web_demo_dir)
    
    print("="*60)
    print("🔐 Face Mask Detector - HTTPS Server")
    print("="*60)
    
    # Try to create HTTPS server
    cert_file, key_file = create_self_signed_cert()
    
    if cert_file and key_file:
        print(f"\n✅ Starting HTTPS server on https://{HOST}:{PORT}/")
        print(f"📁 Serving files from: {web_demo_dir}")
        print("\n🔐 Note: You'll see a security warning (self-signed cert)")
        print("   Click 'Advanced' → 'Proceed to localhost' to continue")
        print("\n⚠️ To stop server: Press Ctrl+C")
        print("="*60)
        print()
        
        with socketserver.TCPServer((HOST, PORT), MyHandler) as httpd:
            httpd.socket = ssl.wrap_socket(
                httpd.socket,
                certfile=cert_file,
                keyfile=key_file,
                server_side=True
            )
            
            url = f"https://{HOST}:{PORT}/index.html"
            webbrowser.open(url)
            
            print(f"✓ Browser opened at: {url}")
            print(f"✓ Server is running...\n")
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n\n🛑 Server stopped by user")
                print("="*60)
    else:
        # Fallback to HTTP
        run_http_server()

def run_http_server():
    print(f"\n✅ Starting HTTP server on http://{HOST}:3000/")
    print(f"📁 Serving files from: {Path(__file__).parent}")
    print("\n⚠️ Note: Camera may not work on HTTP in some browsers")
    print("   If camera fails, use Chrome and allow camera in settings")
    print("\n⚠️ To stop server: Press Ctrl+C")
    print("="*60)
    print()
    
    with socketserver.TCPServer((HOST, 3000), MyHandler) as httpd:
        url = f"http://{HOST}:3000/index.html"
        webbrowser.open(url)
        
        print(f"✓ Browser opened at: {url}")
        print(f"✓ Server is running...\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped by user")
            print("="*60)

if __name__ == "__main__":
    try:
        run_https_server()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"\n❌ Error: Port is already in use!")
            print(f"   Try closing other servers or use a different port\n")
        else:
            print(f"\n❌ Error: {e}\n")
