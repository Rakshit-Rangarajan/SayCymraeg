import requests
import json
from dotenv import load_dotenv
import ollama

# --- CONFIGURATION ---
# Load environment variables from .env file
load_dotenv()

# The base URL of your running Flask API
API_BASE_URL = "http://localhost:5001/api"
OLLAMA_MODEL = 'llama3.1'  # The name of your installed Ollama model


# --- OLLAMA HELPER FUNCTIONS ---

def is_valid_language(language_name: str) -> bool:
    """Checks with Ollama if a given string is a real language."""
    print(f"\n🔍 Verifying if '{language_name}' is a real language...")
    prompt = f"Is '{language_name}' a recognized spoken language? Please answer with only 'yes' or 'no'."
    try:
        response = ollama.chat(
            model=OLLAMA_MODEL,
            messages=[{'role': 'user', 'content': prompt}]
        )
        answer = response['message']['content'].strip().lower()
        if 'yes' in answer:
            print("  ✅ Verification successful.")
            return True
        else:
            print(f"  ❌ Verification failed. Ollama does not recognize '{language_name}' as a language.")
            return False
    except Exception as e:
        print(f"  🚨 Error during language verification with Ollama: {e}")
        return False


def generate_topics_for_language(language: str) -> dict | None:
    """Generates a structured list of topics for a language using Ollama."""
    print(f"\n🧠 Generating learning topics for '{language}'...")
    prompt = f"""
    Create a JSON object containing typical learning topics for the '{language}' language, structured by difficulty.
    The keys should be "Beginner", "Intermediate", "Advanced", and "Master".
    Each key's value should be an array of 5-7 relevant topic strings.
    """
    try:
        response = ollama.chat(
            model=OLLAMA_MODEL,
            messages=[{'role': 'user', 'content': prompt}],
            format='json'  # Use the built-in JSON format
        )
        topics_str = response['message']['content']
        topics = json.loads(topics_str)
        print("  ✅ Successfully generated topics.")
        return topics
    except Exception as e:
        print(f"  🚨 Error generating topics from Ollama: {e}")
        return None


# --- API INTERACTION ---

def process_language_topics(language: str, levels_map: dict):
    """Iterates through generated topics and calls the Flask API to create flashcards."""
    print(f"\n{'=' * 20}\nProcessing generated content for: {language.upper()}\n{'=' * 20}")

    for level, topics in levels_map.items():
        print(f"\n--- Level: {level} ---")
        for topic in topics:
            print(f"  Sending request for topic: '{topic}'...")

            payload = {
                "language": language,
                "level": level,
                "topic": topic
            }

            try:
                response = requests.post(f"{API_BASE_URL}/generate-flashcards", json=payload)
                response.raise_for_status()

                result = response.json()
                if result.get("success"):
                    print(f"    ✅ Success: {result.get('message')}")
                else:
                    print(f"    ❌ Failed: {result.get('error')}")

            except requests.exceptions.RequestException as e:
                print(f"  ❌ CRITICAL ERROR: Could not connect to the API. Is the Flask server running?")
                print(f"     Details: {e}")
                return
            except Exception as e:
                print(f"  ❌ An unexpected error occurred: {e}")


def delete_language_from_db(language: str):
    """Calls the API to delete all data for a specific language."""
    language_to_delete = language.strip().capitalize()
    print(f"\n🔥 Deleting all data for language: {language_to_delete.upper()}")
    confirm = input(
        f"  Are you sure you want to permanently delete all topics and flashcards for '{language_to_delete}'? (y/n): ").lower()

    if confirm != 'y':
        print("  Deletion cancelled.")
        return

    try:
        response = requests.delete(f"{API_BASE_URL}/language/{language_to_delete}")
        response.raise_for_status()
        result = response.json()
        if result.get("success"):
            print(f"  ✅ Success: {result.get('message')}")
        else:
            print(f"  ❌ Failed: {result.get('error')}")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"  ❌ Error: Language '{language_to_delete}' not found in the database.")
        else:
            print(f"  ❌ An unexpected HTTP error occurred: {e}")
    except requests.exceptions.RequestException as e:
        print(f"  ❌ CRITICAL ERROR: Could not connect to the API. Is the Flask server running? ({e})")
    except Exception as e:
        print(f"  ❌ An unexpected error occurred: {e}")


# --- MAIN EXECUTION ---

def main():
    """Main function to drive the console application."""
    print("\n🚀 Dynamic Content Generation Tool (Ollama Edition) 🚀")

    while True:
        print("\n----------------------------------------------------")
        print("Enter a language to CREATE content (e.g., 'French')")
        print("Enter 'delete' to REMOVE a language's data")
        print("Enter 'exit' to quit")
        action = input("Action: ").strip()

        if not action:
            continue
        if action.lower() == 'exit':
            break

        if action.lower() == 'delete':
            lang_to_delete = input("Enter the exact name of the language to delete: ").strip()
            if lang_to_delete:
                delete_language_from_db(lang_to_delete)
        else:
            lang_to_create = action.capitalize()
            if not is_valid_language(lang_to_create):
                continue

            language_topics = generate_topics_for_language(lang_to_create)

            if language_topics:
                process_language_topics(lang_to_create, language_topics)
                print(f"\n✨ Finished processing all topics for {lang_to_create}.")
            else:
                print(f"\nCould not proceed for '{lang_to_create}' due to an error in topic generation.")


if __name__ == "__main__":
    main()
