import json
from yt_dlp import YoutubeDL

CHANNEL_URLS = [
    "https://www.youtube.com/@nguhaynghi",
    "https://www.youtube.com/@DanFoolish",
    # Add more channel URLs here
]
OUTPUT_FILE = "myPlaylist.json"


def fetch_channel_data(channel_url):
    ydl_opts = {
        "quiet": True,
        "extract_flat": True,
        "dump_single_json": True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        data = ydl.extract_info(channel_url, download=False)

    return data


def build_channel_json(channel_data):
    channel_name = channel_data.get("title", "UnknownChannel")

    videos = []
    for entry in channel_data.get("entries", []):
        if entry.get("id") and entry.get("title"):
            videos.append({
                "id": entry["id"],
                "title": entry["title"],
                "subPlaylist": channel_name
            })

    # Add the subplaylist object
    videos.append({
        "id": "subplaylist",
        "title": channel_name,
        "subPlaylist": channel_name
    })

    return videos


def save_json(data, filename):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved: {filename}")


def build_combined_json(channel_urls):
    all_videos = []
    for url in channel_urls:
        data = fetch_channel_data(url)
        channel_videos = build_channel_json(data)
        all_videos.extend(channel_videos)
    return all_videos


if __name__ == "__main__":
    final_json = build_combined_json(CHANNEL_URLS)
    save_json(final_json, OUTPUT_FILE)
