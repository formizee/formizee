-- +goose up
CREATE TABLE metrics.raw_vault_v1(
    type String,
    query String,
    latency Int64,
    time Int64,
)
ENGINE = MergeTree()
ORDER BY (type, query, latency)
;

-- +goose down
DROP TABLE metrics.raw_vault_v1;
