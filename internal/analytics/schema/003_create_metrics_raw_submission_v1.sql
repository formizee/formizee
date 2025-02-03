-- +goose up
CREATE TABLE metrics.raw_submissions_v1(
    endpointId String,
    workspaceId String,

    context_location String,
    context_userAgent String,

    -- unix milli
    uploadedAt Int64,
)
ENGINE = MergeTree()
ORDER BY (uploadedAt, endpointId, workspaceId)
;

-- +goose down
DROP TABLE metrics.raw_submissions_v1;
