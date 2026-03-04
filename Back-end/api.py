import random
import json
import re
from flask import Flask, request, jsonify, send_file, redirect
from flask_cors import CORS
import ollama
from dotenv import load_dotenv
from gtts import gTTS
from io import BytesIO
from datetime import datetime, timezone
import firebase_admin
from firebase_admin import credentials, firestore
import speech_recognition as sr
from pydub import AudioSegment

# --- Swagger/OpenAPI Imports ---
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from apispec_webframeworks.flask import FlaskPlugin
from flask_swagger_ui import get_swaggerui_blueprint

# --- SETUP FIREBASE ---
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"ERROR: Could not initialize Firebase Admin SDK. {e}")
    db = None

load_dotenv()
app = Flask(__name__)
CORS(app)

# --- MODEL CONFIGURATION ---
OLLAMA_MODEL = 'llama3.1'

# --- Leveling System Logic ---
XP_THRESHOLDS = {
    'Beginner': {1: 500, 2: 750, 3: 1000, 4: 1250, 5: 1500},
    'Intermediate': {1: 2000, 2: 2500, 3: 3000, 4: 3500, 5: 4000},
    'Advanced': {1: 5000, 2: 6000, 3: 7000, 4: 8000, 5: 10000},
    'Master': {1: float('inf')}
}


def check_for_level_up(current_level):
    hierarchy = current_level['hierarchy']
    level = current_level['level']
    points = current_level['points']
    has_leveled_up = False
    required_xp = XP_THRESHOLDS.get(hierarchy, {}).get(level)
    while required_xp and points >= required_xp:
        has_leveled_up = True
        points -= required_xp
        level += 1
        if level > 5:
            if hierarchy == 'Beginner':
                hierarchy = 'Intermediate'
                level = 1
            elif hierarchy == 'Intermediate':
                hierarchy = 'Advanced'
                level = 1
            elif hierarchy == 'Advanced':
                hierarchy = 'Master'
                level = 1
        if hierarchy == 'Master':
            break
        required_xp = XP_THRESHOLDS.get(hierarchy, {}).get(level)
    return {'newLevel': {'hierarchy': hierarchy, 'level': level, 'points': points}, 'hasLeveledUp': has_leveled_up}


def calculate_similarity(s1, s2):
    s1, s2 = s1.lower(), s2.lower()
    if len(s1) < len(s2):
        return calculate_similarity(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    distance = previous_row[-1]
    if (len(s1) + len(s2)) == 0:
        return 100.0
    ratio = (len(s1) + len(s2) - distance) / (len(s1) + len(s2))
    return ratio * 100


def delete_collection(coll_ref, batch_size):
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0
    for doc in docs:
        for sub_coll_ref in doc.reference.collections():
            delete_collection(sub_coll_ref, batch_size)
        doc.reference.delete()
        deleted += 1
    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)
    return None


# --- SWAGGER SETUP ---
spec = APISpec(title="SayCymraeg API", version="1.0.0", openapi_version="3.0.2",
               plugins=[FlaskPlugin(), MarshmallowPlugin()])
SWAGGER_URL, API_URL = '/api/docs', '/swagger.json'
swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={'app_name': "SayCymraeg API"})
app.register_blueprint(swaggerui_blueprint)


@app.route('/')
def index():
    return redirect(SWAGGER_URL)


# --- API ENDPOINTS ---
@app.route('/api/speak', methods=['POST'])
def speak_text():
    """
    ---
    post:
      summary: Convert text to speech
      tags: [Utilities]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                text: { type: string, example: "Bore da" }
                lang: { type: string, example: "cy" }
      responses:
        200:
          description: MP3 audio stream.
          content:
            audio/mpeg:
              schema:
                type: string
                format: binary
    """
    data = request.get_json()
    text_to_speak, lang = data.get('text'), data.get('lang', 'cy')
    if not text_to_speak:
        return jsonify({"error": "No text provided"}), 400
    try:
        tts = gTTS(text=text_to_speak, lang=lang, slow=False)
        mp3_fp = BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        return send_file(mp3_fp, mimetype='audio/mpeg')
    except Exception as ex:
        app.logger.error(f"Error in gTTS: {ex}", exc_info=True)
        return jsonify({"error": "Text-to-speech service failed."}), 500


@app.route('/api/word-of-the-day', methods=['GET'])
def get_word_of_the_day():
    """
    ---
    get:
      summary: Get the Word of the Day
      tags: [Content]
      responses:
        200:
          description: Word of the Day object.
    """
    if not db:
        return jsonify({"error": "Firestore not initialized"}), 500
    doc = db.collection('daily_words').document(datetime.now(timezone.utc).strftime('%Y-%m-%d')).get()
    return jsonify(doc.to_dict() if doc.exists else {"welsh": "Cymru", "english": "Wales", "pronunciation": "kum-ree"})


@app.route('/api/get-practice-words', methods=['GET'])
def get_practice_words():
    """
    ---
    get:
      summary: Get practice words for the Pronunciation Tutor
      tags: [Content]
      parameters:
        - { name: level, in: query, schema: { type: string, enum: [Beginner, Intermediate, Advanced, Master] } }
      responses:
        200:
          description: A list of practice word objects.
    """
    if not db:
        return jsonify({"error": "Firestore not initialized"}), 500
    level, language = request.args.get('level', 'Beginner'), request.args.get('language', 'Welsh')
    try:
        topics_ref = db.collection('languages').document(language).collection('levels').document(level).collection(
            'topics')
        topic_docs = list(topics_ref.stream())
        if not topic_docs:
            return jsonify([])
        random_topic = random.choice(topic_docs)
        flashcards_ref = random_topic.reference.collection('flashcards')
        flashcard_docs = list(flashcards_ref.limit(10).stream())

        # FIX: Convert DocumentSnapshot to dict before using .get() with a default value.
        words = []
        for doc in flashcard_docs:
            data = doc.to_dict()
            words.append({
                "welsh": data.get("front"),
                "english": data.get("back"),
                "pronunciation": data.get("pronunciation", "")
            })
        return jsonify(words)
    except Exception as ex:
        app.logger.error(f"Error fetching practice words: {ex}", exc_info=True)
        return jsonify({"error": "Could not fetch practice words."}), 500


@app.route('/api/analyze-speech', methods=['POST'])
def analyze_speech():
    """
    ---
    post:
      summary: Analyze spoken audio for pronunciation
      tags: [AI Tools]
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                audio: { type: string, format: binary }
                targetText: { type: string }
      responses:
        200:
          description: Analysis result with score and transcribed text.
    """
    if 'audio' not in request.files or 'targetText' not in request.form:
        return jsonify({"error": "Missing audio file or target text"}), 400
    audio_file, target_text, lang_code = request.files['audio'], request.form['targetText'], request.form.get(
        'langCode', 'cy-GB')
    recognizer = sr.Recognizer()
    try:
        audio = AudioSegment.from_file(audio_file)
        wav_io = BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)
        with sr.AudioFile(wav_io) as source:
            audio_data = recognizer.record(source)
            transcribed_text = recognizer.recognize_google(audio_data, language=lang_code)
            score = calculate_similarity(target_text, transcribed_text)
            return jsonify({"transcribedText": transcribed_text, "score": score})
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio", "score": 0, "transcribedText": "..."})
    except Exception as ex:
        app.logger.error(f"Error in analyze_speech: {ex}", exc_info=True)
        return jsonify({"error": str(e), "score": 0}), 500


@app.route('/api/chat', methods=['POST'])
def chat_with_tutor():
    """
    ---
    post:
      summary: Chat with the AI Tutor
      tags: [AI Tools]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                message: { type: string, example: "Sut mae'r tywydd heddiw?" }
      responses:
        200:
          description: AI response in Welsh with English translation.
    """
    user_message = request.get_json().get('message')
    prompt = f"You are a friendly Welsh language tutor. Respond concisely and encouragingly. First, respond in Welsh, then provide the English translation in parentheses. User's message: '{user_message}'"
    try:
        response = ollama.chat(model=OLLAMA_MODEL, messages=[{'role': 'user', 'content': prompt}])
        text = response['message']['content']
        match = re.match(r'^(.*?)\s*\((.*?)\)$', text, re.DOTALL)
        welsh_part, english_part = (match.group(1).strip(), match.group(2).strip()) if match else (text,
                                                                                                   "No translation available.")
        return jsonify({"welsh": welsh_part, "english": english_part})
    except Exception as ex:
        app.logger.error(f"Ollama chat error: {ex}", exc_info=True)
        return jsonify({"error": "Could not connect to local Ollama model."}), 500


@app.route('/api/generate-flashcards', methods=['POST'])
def generate_flashcards_endpoint():
    """
    ---
    post:
      summary: Generate a custom topic with flashcards
      tags: [AI Tools]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties: { userId: { type: string }, language: { type: string }, level: { type: string }, description: { type: string }, title: { type: string }, numFlashcards: { type: integer } }
      responses:
        200:
          description: Success message after generating and saving flashcards.
    """
    if not db:
        return jsonify({"error": "Firestore not initialized"}), 500

    data = request.get_json()
    user_id = data.get('userId')
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    source_data = data['topic'] if 'topic' in data and isinstance(data['topic'], dict) else data
    language = data.get('language', source_data.get('language'))
    level = data.get('level', source_data.get('level'))
    description = source_data.get('description')
    title = source_data.get('title')
    num_flashcards = source_data.get('numFlashcards', 20)
    if not language:
        language = 'Welsh'

    if not all([language, level, description]):
        return jsonify({"error": "Missing language, level, or description"}), 400

    try:
        if not title:
            app.logger.info("Generating title from description...")
            title_prompt = f"Based on this description, create a concise topic title (3-5 words max): '{description}'. Respond with ONLY the title."
            response = ollama.chat(model=OLLAMA_MODEL, messages=[{'role': 'user', 'content': title_prompt}])
            title = response['message']['content'].strip().replace('"', '')

        if level == 'Beginner':
            instruction = "Generate single words or very basic two to three-word phrases."
        elif level == 'Intermediate':
            instruction = "Generate short, common sentences (4 to 7 words)."
        elif level == 'Advanced':
            instruction = "Generate longer, more complex sentences (8 to 12 words)."
        elif level == 'Master':
            instruction = "Generate nuanced, complex, or idiomatic sentences (12+ words)."
        else:
            instruction = "Generate a mix of words and simple phrases."
        flashcard_prompt = f"Topic Title: '{title}'. Student's Description: '{description}'. Generate {num_flashcards} flashcards for a '{level}' student learning '{language}'. {instruction}. Provide response as a valid JSON array of objects ONLY: [{{'front': '...', 'back': '...', 'pronunciation': '...'}}]."

        response = ollama.chat(model=OLLAMA_MODEL, messages=[{'role': 'user', 'content': flashcard_prompt}])
        content = response['message']['content']
        json_match = re.search(r'\[.*]', content, re.DOTALL)
        if not json_match:
            raise ValueError(f"No JSON list found in AI response. Content: {content}")

        flashcards = json.loads(json_match.group(0))
        if not isinstance(flashcards, list):
            raise ValueError("Generated content is not a list.")

        topic_id = title.lower().replace(" ", "-").replace("'", "")
        topic_ref = db.collection('languages').document(language).collection('levels').document(level).collection(
            'topics').document(topic_id)

        if not topic_ref.get().exists:
            topic_ref.set(
                {"name": title, "icon": "✨", "description": description, "creatorId": user_id, "isCustom": True})

        batch = db.batch()
        for card in flashcards:
            if isinstance(card, dict) and 'front' in card and 'back' in card:
                card_ref = topic_ref.collection('flashcards').document()
                batch.set(card_ref, card)
        batch.commit()

        return jsonify({"success": True, "message": f"Generated and saved {len(flashcards)} flashcards for '{title}'."})

    except Exception as ex:
        app.logger.error(f"Error in generate_flashcards_endpoint: {ex}", exc_info=True)
        return jsonify({"error": "An unexpected server error occurred during generation."}), 500


@app.route('/api/user/toggle-favorite', methods=['POST'])
def toggle_favorite_topic():
    """
    ---
    post:
      summary: Toggle a topic as a favorite for a user
      tags: [User]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties: { userId: { type: string }, topicId: { type: string } }
    """
    if not db:
        return jsonify({"error": "Firestore not initialized"}), 500
    data = request.get_json()
    user_id, topic_id = data.get('userId'), data.get('topicId')
    if not all([user_id, topic_id]):
        return jsonify({"error": "Missing userId or topicId"}), 400
    try:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        favorited_topics = user_doc.to_dict().get('favoritedTopics', [])

        if topic_id in favorited_topics:
            user_ref.update({'favoritedTopics': firestore.ArrayRemove([topic_id])})
            return jsonify({"success": True, "status": "unfavorited"})
        else:
            user_ref.update({'favoritedTopics': firestore.ArrayUnion([topic_id])})
            return jsonify({"success": True, "status": "favorited"})
    except Exception as ex:
        app.logger.error(f"Error toggling favorite for user {user_id}: {ex}", exc_info=True)
        return jsonify({"error": "Failed to update user profile."}), 500


@app.route('/api/topics/<string:language>/<string:level>/<string:topicId>', methods=['DELETE'])
def delete_custom_topic(language, level, topicid):
    """
    ---
    delete:
      summary: Delete a custom topic created by a user
      tags: [Content]
      parameters:
        - { name: language, in: path, required: true }
        - { name: level, in: path, required: true }
        - { name: topicId, in: path, required: true }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties: { userId: { type: string } }
    """
    if not db:
        return jsonify({"error": "Firestore not initialized"}), 500
    user_id = request.get_json().get('userId')
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    try:
        topic_ref = db.collection('languages').document(language).collection('levels').document(level).collection(
            'topics').document(topicid)
        topic_doc = topic_ref.get()

        if not topic_doc.exists:
            return jsonify({"error": "Topic not found"}), 404

        topic_data = topic_doc.to_dict()
        if not topic_data.get('isCustom') or topic_data.get('creatorId') != user_id:
            return jsonify({"error": "Permission denied. You can only delete your own custom topics."}), 403

        delete_collection(topic_ref.collection('flashcards'), 50)
        topic_ref.delete()

        return jsonify({"success": True, "message": "Topic deleted successfully."})
    except Exception as ex:
        app.logger.error(f"Error deleting topic {topicid}: {ex}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred during deletion."}), 500


@app.route('/api/topics', methods=['GET'])
def get_topics():
    """
    ---
    get:
      summary: Get all topics available up to the user's level
      tags: [Content]
      parameters:
        - { name: language, in: query, required: false }
        - { name: level, in: query, required: false }
        - { name: userId, in: query, required: true }
      responses:
        200:
          description: A list of topic objects with progress and favorite status.
    """
    if not db:
        return jsonify({"error": "Firestore not initialized"}), 500

    # FIX: Set defaults for language and level, but require userId.
    language = request.args.get('language', 'Welsh')
    level = request.args.get('level', 'Beginner')
    user_id = request.args.get('userId')

    if not user_id:
        return jsonify({"error": "Missing required 'userId' parameter"}), 400

    try:
        user_doc = db.collection('users').document(user_id).get()
        favorited_topics = user_doc.to_dict().get('favoritedTopics', []) if user_doc.exists else []

        hierarchy = ['Beginner', 'Intermediate', 'Advanced', 'Master']
        user_level_index = hierarchy.index(level) if level in hierarchy else 0
        levels_to_fetch = hierarchy[:user_level_index + 1]

        all_topics = []
        for l in levels_to_fetch:
            topics_ref = db.collection('languages').document(language).collection('levels').document(l).collection(
                'topics')
            for topic in topics_ref.stream():
                topic_data = topic.to_dict()
                topic_id = topic.id
                topic_data.update({
                    'id': topic_id,
                    'difficulty': l,
                    'isFavorited': topic_id in favorited_topics,
                    'isCustom': topic_data.get('isCustom', False),
                    'creatorId': topic_data.get('creatorId', None)
                })
                count_query = topic.reference.collection('flashcards').count()
                topic_data['totalCards'] = count_query.get()[0][0].value
                all_topics.append(topic_data)
        return jsonify(all_topics)
    except Exception as ex:
        app.logger.error(f"Error fetching topics: {ex}", exc_info=True)
        return jsonify({"error": str(ex)}), 500


@app.route('/api/flashcards', methods=['GET'])
def get_flashcards():
    """
    ---
    get:
      summary: Get all flashcards for a specific topic
      tags: [Content]
      parameters:
        - { name: language, in: query, required: true }
        - { name: level, in: query, required: true }
        - { name: topicId, in: query, required: true }
      responses:
        200:
          description: A list of flashcard objects.
    """
    if not db:
        return jsonify({"error": "Firestore not initialized"}), 500
    language, level, topic_id = request.args.get('language'), request.args.get('level'), request.args.get('topicId')
    if not all([language, level, topic_id]):
        return jsonify({"error": "Missing required fields"}), 400
    try:
        flashcards_ref = db.collection('languages').document(language).collection('levels').document(level).collection(
            'topics').document(topic_id).collection('flashcards')
        cards_list = [card.to_dict() for card in flashcards_ref.stream()]
        return jsonify(cards_list)
    except Exception as ex:
        app.logger.error(f"Error fetching flashcards: {ex}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred."}), 500


@app.route('/api/user/learned-word', methods=['POST'])
def add_learned_word():
    """
    ---
    post:
      summary: Mark a word as learned and add XP
      tags: [User]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
    """
    if not db:
        return jsonify({"error": "Firestore not initialized"}), 500
    data = request.get_json()
    user_id, word, topic_id, language, points_to_add = data.get('userId'), data.get('word'), data.get(
        'topicId'), data.get('language'), data.get('points', 10)
    if not all([user_id, word, topic_id, language]):
        return jsonify({"error": "Missing required fields"}), 400
    try:
        user_ref = db.collection('users').document(user_id)

        @firestore.transactional
        def update_in_transaction(transaction, user_reference):
            snapshot = user_reference.get(transaction=transaction)
            if not snapshot.exists:
                raise Exception("User not found")

            # FIX: Safely get user data, providing defaults if they don't exist
            user_data = snapshot.to_dict()
            current_level_data = user_data.get('level') or {'hierarchy': 'Beginner', 'level': 1, 'points': 0}
            learned_words = user_data.get('learnedWords') or []

            if not isinstance(learned_words, list):
                learned_words = []

            word_to_learn = {**word, 'topicId': topic_id, 'language': language}
            if any(w.get('front') == word.get('front') and w.get('topicId') == topic_id for w in learned_words):
                return None

            transaction.update(user_reference, {'learnedWords': firestore.ArrayUnion([word_to_learn])})
            current_level_data['points'] += points_to_add
            level_check_result = check_for_level_up(current_level_data)
            transaction.update(user_reference, {'level': level_check_result['newLevel']})

            return level_check_result['newLevel'] if level_check_result['hasLeveledUp'] else None

        level_up_info = update_in_transaction(db.transaction(), user_ref)
        return jsonify({"success": True, "message": "Progress saved.", "levelUpInfo": level_up_info})
    except Exception as ex:
        app.logger.error(f"Error adding learned word for user {user_id}: {ex}", exc_info=True)
        return jsonify({"error": "Failed to update user profile."}), 500


with app.test_request_context():
    for func in [speak_text, chat_with_tutor, generate_flashcards_endpoint, get_word_of_the_day,
                 get_practice_words, analyze_speech, get_topics, get_flashcards,
                 add_learned_word, toggle_favorite_topic, delete_custom_topic]:
        spec.path(view=func)


@app.route('/swagger.json')
def create_swagger_spec():
    return jsonify(spec.to_dict())


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)