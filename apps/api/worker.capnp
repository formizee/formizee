using Workerd = import "/workerd/workerd.capnp";

const mainWorker :Workerd.Worker = (
  globalOutbound = "fullNetwork",
  modules = [
    (name = "worker", esModule = embed "./dist/index.js")
  ],

bindings = [
    ( name = "DASHBOARD_URL", fromEnvironment= "DASHBOARD_URL"),
    ( name = "VAULT_URL", fromEnvironment= "VAULT_URL"),
    ( name = "DOCS_URL", fromEnvironment= "DOCS_URL"),
    ( name = "API_URL", fromEnvironment= "API_URL"),
    ( name = "WEB_URL", fromEnvironment= "WEB_URL"),

    ( name = "DATABASE_AUTH_TOKEN", fromEnvironment= "DATABASE_AUTH_TOKEN"),
    ( name = "DATABASE_URL", fromEnvironment= "DATABASE_URL"),

    ( name = "VAULT_SECRET", fromEnvironment= "VAULT_SECRET"),

    ( name = "TINYBIRD_URL", fromEnvironment= "TINYBIRD_URL"),
    ( name = "TINYBIRD_TOKEN", fromEnvironment= "TINYBIRD_TOKEN"),

    ( name = "AWS_SES_ACCESS_KEY", fromEnvironment= "AWS_SES_ACCESS_KEY"),
    ( name = "AWS_SES_SECRET_ACCESS_KEY", fromEnvironment= "AWS_SES_SECRET_ACCESS_KEY"),

    ( name = "LOGTAIL_TOKEN", fromEnvironment= "LOGTAIL_TOKEN"),
    ( name = "EMIT_LOGS", fromEnvironment= "EMIT_LOGS"),

    ( name = "ENVIROMENT", fromEnvironment= "ENVIROMENT"),
    ( name = "VERSION", fromEnvironment= "VERSION"),
  ],

  compatibilityDate = "2024-02-19",
  compatibilityFlags = ["nodejs_compat"]
  # Learn more about compatibility dates at:
  # https://developers.cloudflare.com/workers/platform/compatibility-dates/

  
);

const config :Workerd.Config = (
  services = [
    (
      name = "main", 
      worker = .mainWorker,
    ),
    (
      name = "fullNetwork",
      network = (
  allow = ["public", "private", "local", "network", "unix", "unix-abstract"],
  tlsOptions = (trustBrowserCas = true)
)
    )
  ],

  sockets = [
    # Serve HTTP on port 8787.
    ( name = "http",
      address = "*:8787",
      http = (),
      service = "main"
    ),
  ]
);
