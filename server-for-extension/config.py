import os

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
IMAGE_UPLOADS = PROJECT_ROOT + "/files/"
MAX_CONTENT_LENGTH = 16 * 1024 * 1024
DB_HOST = 'localhost'
DB_PORT = 27017

DICTIONARY = PROJECT_ROOT + "/current_dictionary.dict"
# Use a secure, unique and absolutely secret key for
# signing the data.
CSRF_SESSION_KEY = "covid19server"

# Secret key for signing cookies
SECRET_KEY = "covid19secret"