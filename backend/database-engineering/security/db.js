const { Pool } = require('pg');
require('dotenv').config();

// 공통 설정 (Host, Port, Database 등)
const baseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'mydb',
};

// 1. Read Pool (사용량이 많으므로 더 많은 연결 할당)
const readPool = new Pool({
    ...baseConfig,
    user: process.env.DB_USER_READ,
    password: process.env.DB_PASSWORD_READ,
    max: 20, // 최대 연결 수 넉넉히
    idleTimeoutMillis: 30000,
});

// 2. Create Pool (상대적으로 낮은 빈도)
const createPool = new Pool({
    ...baseConfig,
    user: process.env.DB_USER_CREATE,
    password: process.env.DB_PASSWORD_CREATE,
    max: 5,
});

// 3. Delete Pool
const deletePool = new Pool({
    ...baseConfig,
    user: process.env.DB_USER_DELETE,
    password: process.env.DB_PASSWORD_DELETE,
    max: 2,
});

module.exports = { readPool, createPool, deletePool };
