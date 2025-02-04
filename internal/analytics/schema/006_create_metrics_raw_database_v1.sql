-- +goose up
CREATE TABLE metrics.raw_database_v1(
    dbName String,
    query String,
    type String,
    latency Int64,
)
ENGINE = MergeTree()
ORDER BY (dbName, query, type)
;

-- +goose down
DROP TABLE metrics.raw_database_v1;
