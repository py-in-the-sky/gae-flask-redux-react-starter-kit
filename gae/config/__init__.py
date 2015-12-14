from .production import Production

try:
    from .test import Test
except ImportError:
    Test = Production

try:
    from .development import Development
except ImportError:
    Development = Production


config = {
    'test': Test,
    'production': Production,
    'development': Development
}
