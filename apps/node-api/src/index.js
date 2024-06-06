"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_server_1 = require("@hono/node-server");
var hono_1 = require("hono");
require("@/lib/config");
var app = new hono_1.Hono();
app.get('/', function (c) {
    return c.text('Hello Hono!');
});
console.log("Server is running on port ".concat(process.env.PORT));
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: Number(process.env.PORT)
});
