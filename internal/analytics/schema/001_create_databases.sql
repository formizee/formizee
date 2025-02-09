-- +goose up

CREATE DATABASE telemetry;
CREATE DATABASE metrics;
CREATE DATABASE audit;


-- +goose down
DROP DATABASE telemetry;
DROP DATABASE metrics;
DROP DATABASE audit;
