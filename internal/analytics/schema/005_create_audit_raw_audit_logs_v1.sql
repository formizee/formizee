-- +goose up
CREATE TABLE audit.raw_audit_logs_v1(
    -- Actor properties
    actor_id String,
    actor_name String,
    actor_type String,
    
    -- context
    context_location String,
    context_userAgent String,

    -- unix milli
    time Int64,

    workspaceId String,
    auditLogId String,

    description String,
    resources String,
    event String,
)
ENGINE = MergeTree()
ORDER BY (resources, workspaceId, time)
;

-- +goose down
DROP TABLE audit.raw_audit_logs_v1;
