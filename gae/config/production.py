from .config import Config


class Production(Config):
    FLASK_CONFIG = 'production'
