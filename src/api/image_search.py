import os
import requests
import traceback

from flask import Blueprint, request, jsonify

image_search = Blueprint("image_search", __name__)

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY") or os.getenv("HUGGINGFACE_API_TOKEN")
TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")

HUGGINGFACE_MODEL_URL = "https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224"
TICKETMASTER_URL = "https://app.ticketmaster.com/discovery/v2/events.json"


EVENT_CATEGORY_MAP = {
    "football": {
       "event_type": "football",
       "classification": "Sports",
       "keywords": [
         "sports", "football", "soccer", "soccer ball", "football player",
         "stadium", "goal", "goalkeeper", "sports ball",
         "ballplayer", "scoreboard", "pitch"
    ],
    "search_terms": ["soccer", "football", "fútbol", "futbol", "laliga", "real madrid", "barcelona", "atletico madrid", "atlético madrid", "valencia cf", "sevilla fc", "real betis", "athletic club","villarreal","getafe","osasuna"]
    },
   
    "basketball": {
        "event_type": "basketball",
        "classification": "Sports",
        "keywords": [
            "basketball", "basketball court", "basketball player",
            "hoop", "backboard", "nba"
        ],
        "search_terms": ["basketball", "baloncesto"]
    },
    "tennis": {
        "event_type": "tennis",
        "classification": "Sports",
        "keywords": [
            "tennis", "tennis ball", "tennis racket",
            "racket", "tennis court"
        ],
        "search_terms": ["tennis", "tenis"]
    },
    "boxing": {
        "event_type": "boxing",
        "classification": "Sports",
        "keywords": [
            "boxing", "boxer", "boxing glove", "ring"
        ],
        "search_terms": ["boxing", "boxeo"]
    },
    "concert": {
        "event_type": "concert",
        "classification": "Music",
        "keywords": [
            "concert", "stage", "microphone", "singer",
            "band", "music", "festival", "guitar",
            "drum", "audience", "spotlight", "crowd",
            "performance", "theater curtain", "theatre curtain"
        ],
        "search_terms": ["concert", "music", "festival", "live music"]
    },
    "theatre": {
        "event_type": "theatre",
        "classification": "Arts & Theatre",
        "keywords": [
            "theatre", "theater", "actor", "actress",
            "opera", "musical", "play", "drama"
        ],
        "search_terms": ["theatre", "theater", "musical", "opera"]
    }
}


def analyze_image_with_huggingface(image_url):
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/octet-stream"
    }

    try:
        image_response = requests.get(image_url, timeout=25)

        if image_response.status_code != 200:
            print("Error descargando imagen:", image_response.status_code)
            return []

        response = requests.post(
            HUGGINGFACE_MODEL_URL,
            headers=headers,
            data=image_response.content,
            timeout=45
        )

        if response.status_code != 200:
            print("Error Hugging Face:", response.status_code, response.text)
            return []

        data = response.json()
        labels = []

        if isinstance(data, list):
            for item in data:
                label = item.get("label", "").lower()
                score = item.get("score", 0)

                if label and score >= 0.15:
                    labels.append({
                        "label": label,
                        "score": score
                    })

        return labels

    except Exception as error:
        print("Error en analyze_image_with_huggingface:", error)
        return []


def detect_event_category(labels):
    category_scores = {
        "football": 0,
        "basketball": 0,
        "tennis": 0,
        "boxing": 0,
        "concert": 0,
        "theatre": 0
    }

    concert_signals = [
        "stage", "spotlight", "audience", "crowd", "concert",
        "music", "band", "singer", "microphone", "guitar",
        "drum", "festival", "performance", "theater curtain",
        "theatre curtain"
    ]

    theatre_signals = [
        "theatre", "theater", "opera", "actor", "actress",
        "musical", "play", "drama"
    ]

    football_signals = [
        "sports", "football", "soccer", "soccer ball", "stadium",
        "goal", "goalkeeper", "football player", "sports ball"
    ]

    basketball_signals = [
        "basketball", "hoop", "backboard", "basketball court"
    ]

    tennis_signals = [
        "tennis", "racket", "tennis ball", "tennis court"
    ]

    boxing_signals = [
        "boxing", "boxer", "boxing glove", "ring"
    ]

    for detected in labels:
        label = detected["label"].lower()
        score = detected["score"]

        if any(word in label for word in concert_signals):
            category_scores["concert"] += score * 1.8

        if any(word in label for word in theatre_signals):
            category_scores["theatre"] += score * 1.2

        if any(word in label for word in football_signals):
            category_scores["football"] += score * 2

        if any(word in label for word in basketball_signals):
            category_scores["basketball"] += score * 2

        if any(word in label for word in tennis_signals):
            category_scores["tennis"] += score * 2

        if any(word in label for word in boxing_signals):
            category_scores["boxing"] += score * 2

    category_scores = {
        key: value for key, value in category_scores.items()
        if value > 0
    }

    if not category_scores:
        return None

    best_category_name = max(category_scores, key=category_scores.get)
    best_config = EVENT_CATEGORY_MAP[best_category_name]

    return {
        **best_config,
        "category_score": category_scores[best_category_name],
        "category_scores": category_scores
    }


def search_ticketmaster_events(config, city=None, country_code="ES"):
    all_events = []

    for search_term in config["search_terms"]:
        params = {
            "apikey": TICKETMASTER_API_KEY,
            "keyword": search_term,
            "countryCode": country_code,
            "size": 50,
            "sort": "date,asc"
        }

        if config["event_type"] != "football":
            params["classificationName"] = config["classification"]

        if city:
            params["city"] = city

        try:
            response = requests.get(TICKETMASTER_URL, params=params, timeout=30)

            print("Buscando en Ticketmaster:", params)
            print("Status Ticketmaster:", response.status_code)

            if response.status_code != 200:
                print("Error Ticketmaster:", response.status_code, response.text)
                continue

            data = response.json()
            events = data.get("_embedded", {}).get("events", [])

            print("Eventos encontrados con", search_term, ":", len(events))

            all_events.extend(events)

        except Exception as error:
            print("Error en search_ticketmaster_events:", error)

    return all_events

def remove_duplicate_events(events):
    unique_events = []
    seen_ids = set()

    for event in events:
        event_id = event.get("id")

        if event_id and event_id not in seen_ids:
            seen_ids.add(event_id)
            unique_events.append(event)

    return unique_events


def get_event_text(event):
    text_parts = [
        event.get("name", ""),
        event.get("info", ""),
        event.get("pleaseNote", "")
    ]

    venues = event.get("_embedded", {}).get("venues", [])

    if venues:
        venue = venues[0]
        text_parts.append(venue.get("name", ""))
        text_parts.append(venue.get("city", {}).get("name", ""))
        text_parts.append(venue.get("country", {}).get("name", ""))

    for classification in event.get("classifications", []):
        text_parts.append(classification.get("segment", {}).get("name", ""))
        text_parts.append(classification.get("genre", {}).get("name", ""))
        text_parts.append(classification.get("subGenre", {}).get("name", ""))

    return " ".join(text_parts).lower()


def is_relevant_event(event, config):
    text = get_event_text(event)

    if config["event_type"] == "football":
        blocked_words = [
            "basketball", "baloncesto", "basket",
            "tennis", "tenis",
            "boxing", "boxeo",
            "hockey", "motor", "motos"
        ]

        if any(word in text for word in blocked_words):
            return False

        football_words = [
            "football", "soccer", "fútbol", "futbol",
            "laliga", "liga", "fc ", "cf ",
            "real madrid", "barcelona", "atlético", "atletico",
            "uefa", "champions", "euro"
        ]

        classifications = event.get("classifications", [])

        is_sport = any(
            classification.get("segment", {}).get("name", "").lower() == "sports"
            for classification in classifications
        )

        has_football_word = any(word in text for word in football_words)

        return has_football_word or is_sport

    return any(
        term.lower() in text
        for term in config["search_terms"]
    )


def score_event(event, config):
    score = 0
    text = get_event_text(event)
    name = event.get("name", "").lower()

    for term in config["search_terms"]:
        term = term.lower()

        if term in name:
            score += 50

        if term in text:
            score += 20

    for classification in event.get("classifications", []):
        segment_name = classification.get("segment", {}).get("name", "").lower()

        if config["classification"].lower() == segment_name:
            score += 30

    return score


def format_event(event, config):
    dates = event.get("dates", {}).get("start", {})
    venues = event.get("_embedded", {}).get("venues", [])
    venue = venues[0] if venues else {}

    images = event.get("images", [])
    image_url = images[0].get("url") if images else None

    return {
        "id": event.get("id"),
        "name": event.get("name"),
        "event_type": config["event_type"],
        "classification": config["classification"],
        "date": dates.get("localDate"),
        "time": dates.get("localTime"),
        "venue": venue.get("name"),
        "city": venue.get("city", {}).get("name"),
        "country": venue.get("country", {}).get("name"),
        "image": image_url,
        "url": event.get("url"),
        "score": score_event(event, config)
    }


@image_search.route("/search-by-image", methods=["POST"])
def search_by_image():
    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"message": "No se enviaron datos"}), 400

        image_url = (
            data.get("image_url")
            or data.get("url")
            or data.get("secure_url")
        )

        city = data.get("city")
        country_code = data.get("country_code", "ES")

        if not image_url:
            return jsonify({
                "message": "Falta image_url",
                "received_data": data
            }), 400

        if not HUGGINGFACE_API_KEY:
            return jsonify({"message": "Falta HUGGINGFACE_API_KEY en .env"}), 500

        if not TICKETMASTER_API_KEY:
            return jsonify({"message": "Falta TICKETMASTER_API_KEY en .env"}), 500

        labels = analyze_image_with_huggingface(image_url)

        if not labels:
            return jsonify({
                "message": "No se pudo detectar una categoría clara en la imagen",
                "image_url": image_url,
                "detected_labels": [],
                "detected_event_type": None,
                "category_scores": {},
                "events_count": 0,
                "events": []
            }), 200

        config = detect_event_category(labels)

        if not config:
            return jsonify({
                "message": "La imagen fue analizada, pero no coincide con una categoría soportada",
                "image_url": image_url,
                "detected_labels": labels,
                "detected_event_type": None,
                "category_scores": {},
                "events_count": 0,
                "events": []
            }), 200

        ticketmaster_events = search_ticketmaster_events(
            config=config,
            city=city,
            country_code=country_code
        )

        unique_events = remove_duplicate_events(ticketmaster_events)

        relevant_events = [
            event for event in unique_events
            if is_relevant_event(event, config)
        ]

        formatted_events = [
            format_event(event, config)
            for event in relevant_events
        ]

        formatted_events.sort(key=lambda event: event["score"], reverse=True)

        return jsonify({
            "message": "Búsqueda realizada correctamente",
            "image_url": image_url,
            "detected_labels": labels,
            "detected_event_type": config["event_type"],
            "classification": config["classification"],
            "category_score": config["category_score"],
            "category_scores": config["category_scores"],
            "events_count": len(formatted_events),
            "events": formatted_events
        }), 200

    except Exception as error:
        print("ERROR EN /search-by-image:")
        traceback.print_exc()

        return jsonify({
            "message": "Error interno en search-by-image",
            "error": str(error)
        }), 500