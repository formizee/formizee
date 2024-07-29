using Workerd = import "/workerd/workerd.capnp";

const mainWorker :Workerd.Worker = (
  globalOutbound = "fullNetwork",
  modules = [
    (name = "worker", esModule = embed "./dist/index.js")
  ],

bindings = [
    ( name = "API_URL", fromEnvironment= "API_URL"),
    ( name = "WEB_URL", fromEnvironment= "WEB_URL"),
    ( name = "DOCS_URL", fromEnvironment= "DOCS_URL"),

    ( name = "DATABASE_URL", fromEnvironment= "DATABASE_URL"),

    ( name = "TINYBIRD_URL", fromEnvironment= "TINYBIRD_URL"),
    ( name = "TINYBIRD_TOKEN", fromEnvironment= "TINYBIRD_TOKEN"),

    ( name = "RESEND_TOKEN", fromEnvironment= "RESEND_TOKEN"),

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
