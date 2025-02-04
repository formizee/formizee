-- +goose up
CREATE TABLE metrics.raw_cache_v1(
    type String,
    hit Boolean,
    key String,
    latency Int64,
)
ENGINE = MergeTree()
ORDER BY (key, type)
;

-- +goose down
DROP TABLE metrics.raw_cache_v1;
