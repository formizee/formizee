using Workerd = import "/workerd/workerd.capnp";

const mainWorker :Workerd.Worker = (
  globalOutbound = "fullNetwork",
  modules = [
    (name = "worker", esModule = embed "./dist/index.js")
  ],

bindings = [
    ( name = "ENVIROMENT", fromEnvironment= "ENVIROMENT"),

    ( name = "DATABASE_URL", fromEnvironment= "DATABASE_URL"),

    ( name = "STORAGE_SECRET_ACCESS_KEY", fromEnvironment= "STORAGE_SECRET_ACCESS_KEY"),
    ( name = "STORAGE_ACCESS_KEY_ID", fromEnvironment= "STORAGE_ACCESS_KEY_ID"),
    ( name = "STORAGE_ENDPOINT", fromEnvironment= "STORAGE_ENDPOINT"),
    ( name = "STORAGE_BUCKET", fromEnvironment= "STORAGE_BUCKET"),

    ( name = "TINYBIRD_URL", fromEnvironment= "TINYBIRD_URL"),
    ( name = "TINYBIRD_TOKEN", fromEnvironment= "TINYBIRD_TOKEN"),

    ( name = "LOGTAIL_TOKEN", fromEnvironment= "LOGTAIL_TOKEN"),
    ( name = "EMIT_LOGS", fromEnvironment= "EMIT_LOGS"),
  ],

  compatibilityDate = "2024-09-23",
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
    # Serve HTTP on port 8888.
    ( name = "http",
      address = "*:8888",
      http = (),
      service = "main"
    ),
  ]
);
