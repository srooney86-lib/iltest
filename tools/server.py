#!/usr/bin/env python3
"""
로컬 오프라인 테스트 서버 (Local Offline Testing Server)
실행 시 http://localhost:8000 으로 웹 브라우저를 자동 오픈하여 오프라인에서 즉시 테스트할 수 있습니다.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # 로컬 테스트 편의를 위한 캐시 방지 및 CORS 헤더 추가
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 60)
        print("🕵️‍♂️ [미스터리 팩트체크 본부] 로컬 테스트 서버가 시작되었습니다.")
        print(f"🌐 접속 주소: {url}")
        print("💡 종료하려면 콘솔 창에서 Ctrl + C 를 누르세요.")
        print("=" * 60)
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n서버를 종료합니다.")

if __name__ == "__main__":
    run_server()
