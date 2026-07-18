import os


def define_env(env):
    """
    Hook executed by Zensical during site builds.
    Injects dynamic environment variables into the context.
    """
    env.variables["app_base_url"] = os.getenv("APP_BASE_URL", "http://localhost:5173")
