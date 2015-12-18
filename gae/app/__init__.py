def create_app(config):
    from flask import Flask
    app = Flask(__name__)
    app.config.from_object(config)

    config.init_app(app)

    from .api import api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')


    @app.route('/_ah/warmup')
    def warmup():
        return 'Warmed up!'


    return app
