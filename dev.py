import json
import webview
from pathlib import Path
from api import API

if __name__ == "__main__":
    config: dict = json.loads(Path("config.json").read_text())
    window_title = config.get("window-title", "My App")
    dev_mode = config.get("dev-mode", False)
    dev_url = config.get("dev-url", "http://localhost:5173")
    debug = config.get("debug", False)

    webview.create_window(
        title=window_title,
        url=dev_url,
        js_api=API(),
        maximized=True
    )
    webview.start(
        debug=debug,  # Enable debug mode for development
        gui="edgechromium"
    )