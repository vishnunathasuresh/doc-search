
import webview
from pathlib import Path
import json
from api import API

if __name__ == "__main__":
    window_title = "DocSearch"

    window = webview.create_window(window_title, "web/index.html", js_api=API())
    webview.start()
