import os
import requests
from flask import Blueprint, request, jsonify

image_search = Blueprint("image_search", __name__)

TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

HUGGINGFACE_MODEL_URL = "https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224"


def analyze_image_with_huggingface(image_url):
    if not HUGGINGFACE_API_TOKEN:
        print("Falta HUGGINGFACE_API_TOKEN")
        return []

    image_response = requests.get(image_url)

    if image_response.status_code != 200:
        print("No se pudo descargar la imagen desde Cloudinary")
        return []

    content_type = image_response.headers.get("Content-Type", "image/jpeg")

    response = requests.post(
        HUGGINGFACE_MODEL_URL,
        headers={
            "Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}",
            "Content-Type": content_type
        },
        data=image_response.content
    )

    if response.status_code != 200:
        print("Error Hugging Face:", response.status_code, response.text)
        return []

    data = response.json()

    print("HuggingFace raw:", data)

    labels = []

    for item in data:
        label = item.get("label")
        score = item.get("score", 0)

        if label and score > 0.05:
            labels.append(label)

    return labels


def normalize_tags_to_keywords(tags):
    keywords = []

    music_words = [
        "stage", "microphone", "guitar", "piano", "drum", "musician",
        "singer", "concert", "spotlight", "performance", "band",
        "audience", "crowd", "speaker", "music"
    ]

    sports_words = [
        "stadium", "football", "soccer", "basketball", "ball",
        "soccer ball", "sports ball", "jersey", "player", "team",
        "racket", "tennis", "baseball", "swimming", "sport",
        "sports", "arena"
    ]

    theatre_words = [
        "theater", "theatre", "curtain", "stage curtain",
        "ballet", "dance", "dancer", "costume", "opera", "drama"
    ]

    art_words = [
        "museum", "painting", "art", "gallery",
        "sculpture", "exhibition", "drawing"
    ]

    food_words = [
        "restaurant", "food", "dish", "meal",
        "menu", "chef", "table", "drink"
    ]

    outdoor_words = [
        "beach", "park", "mountain", "lake",
        "river", "forest", "landscape", "outdoor",
        "umbrella"
    ]

    for tag in tags:
        clean_tag = tag.lower().strip()

        if any(word in clean_tag for word in sports_words):
            keywords.append("sports")

        elif any(word in clean_tag for word in music_words):
            keywords.append("music")

        elif any(word in clean_tag for word in theatre_words):
            keywords.append("theatre")

        elif any(word in clean_tag for word in art_words):
            keywords.append("arts")

        elif any(word in clean_tag for word in food_words):
            keywords.append("food festival")

        elif any(word in clean_tag for word in outdoor_words):
            keywords.append("outdoor festival")

    return list(set(keywords))


def infer_event_keywords_from_labels(labels):
    clean_labels = [label.lower().strip() for label in labels]

    sports_signals = [
        "sports ball", "soccer ball", "football", "soccer",
        "stadium", "ball", "jersey", "player", "team",
        "basketball", "tennis", "racket", "baseball"
    ]

    music_signals = [
        "guitar", "microphone", "piano", "drum",
        "speaker", "concert", "band", "musician", "singer"
    ]

    theatre_signals = [
        "curtain", "theater", "theatre", "stage curtain",
        "opera", "ballet", "drama"
    ]

    if any(signal in label for label in clean_labels for signal in sports_signals):
        return ["sports"]

    if any(signal in label for label in clean_labels for signal in theatre_signals):
        return ["theatre"]

    if any(signal in label for label in clean_labels for signal in music_signals):
        return ["music"]

    return normalize_tags_to_keywords(labels)


def search_ticketmaster(keyword, country_code="ES"):
    url = "https://app.ticketmaster.com/discovery/v2/events.json"

    params = {
        "apikey": TICKETMASTER_API_KEY,
        "keyword": keyword,
        "countryCode": country_code,
        "size": 12,
        "sort": "date,asc"
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        print("Error Ticketmaster:", response.status_code, response.text)
        return []

    data = response.json()
    events = data.get("_embedded", {}).get("events", [])

    clean_events = []

    for event in events:
        venue = None
        venues = event.get("_embedded", {}).get("venues", [])

        if len(venues) > 0:
            venue = venues[0]

        clean_events.append({
            "id": event.get("id"),
            "name": event.get("name"),
            "url": event.get("url"),
            "date": event.get("dates", {}).get("start", {}).get("localDate"),
            "time": event.get("dates", {}).get("start", {}).get("localTime"),
            "image": event.get("images", [{}])[0].get("url"),
            "venue": venue.get("name") if venue else None,
            "city": venue.get("city", {}).get("name") if venue else None,
            "country": venue.get("country", {}).get("name") if venue else None
        })

    return clean_events


@image_search.route("/search-by-image", methods=["POST"])
def search_by_image():
    body = request.get_json()

    if body is None:
        return jsonify({"message": "Debes enviar un JSON"}), 400

    image_url = body.get("image_url")

    if not image_url:
        return jsonify({"message": "image_url es obligatorio"}), 400

    if not TICKETMASTER_API_KEY:
        return jsonify({"message": "Falta TICKETMASTER_API_KEY"}), 500

    labels = analyze_image_with_huggingface(image_url)
    keywords = infer_event_keywords_from_labels(labels)

    if len(keywords) == 0:
        return jsonify({
            "image_url": image_url,
            "labels_detected": labels,
            "keywords": [],
            "events": [],
            "message": "No se pudo relacionar esta imagen con una categoría de eventos."
        }), 200

    all_events = []

    for keyword in keywords:
        events = search_ticketmaster(keyword)
        all_events.extend(events)

    unique_events = {}

    for event in all_events:
        event_name = event.get("name") or ""
        event_image = event.get("image") or ""
        event_date = event.get("date") or ""

        key = f"{event_name}-{event_image}-{event_date}"

        if key not in unique_events:
            unique_events[key] = event

    return jsonify({
        "image_url": image_url,
        "labels_detected": labels,
        "keywords": keywords,
        "events": list(unique_events.values())
    }), 200