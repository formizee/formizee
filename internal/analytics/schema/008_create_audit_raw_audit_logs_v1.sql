-- +goose up
CREATE TABLE audit.raw_audit_logs_v1(
    -- Actor properties
    actor Tuple(
      type String,
      id   String,
      name Nullable(String),
      meta Nullable(String)
    ),
    
    -- context
    context Tuple(
      location String,
      userAgent Nullable(String)
    ),

    -- unix milli
    time Int64,

    workspaceId String,
    auditLogId String,

    resources Array(
      Tuple(
        type String,
        name Nullable(String),
        id String,
        meta Nullable(String)
      )
    ),
    description String,
    event String,
)
ENGINE = MergeTree()
ORDER BY (workspaceId, event, time)
;

-- +goose down
DROP TABLE audit.raw_audit_logs_v1;
