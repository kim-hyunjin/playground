const express = require('express');
const { readPool, createPool, deletePool } = require('./db');
const app = express();

app.use(express.json());

// [베스트 프랙티스] Unbounded Query 방지 (LIMIT 적용)
app.get('/users', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // 기본 10개로 제한
        const offset = parseInt(req.query.offset) || 0;
        
        // Read 전용 풀 사용
        const result = await readPool.query(
            'SELECT id, username, email FROM users ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        res.json(result.rows);
    } catch (err) {
        next(err); // 에러 핸들러로 전달
    }
});

// [베스트 프랙티스] 시퀀스 권한이 필요한 Create
app.post('/users', async (req, res, next) => {
    const { username, email } = req.body;
    try {
        // Create 전용 풀 사용
        const result = await createPool.query(
            'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
            [username, email]
        );
        res.status(201).json({ id: result.rows[0].id, message: 'User created' });
    } catch (err) {
        next(err);
    }
});

// [베스트 프랙티스] 식별을 위한 SELECT 권한이 포함된 Delete
app.delete('/users/:id', async (req, res, next) => {
    try {
        // Delete 전용 풀 사용
        const result = await deletePool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [req.params.id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: `User ${req.params.id} deleted` });
    } catch (err) {
        next(err);
    }
});

// [베스트 프랙티스] 에러 메시지 관리 (내부 정보 은폐)
app.use((err, req, res, next) => {
    // 서버 로그에는 상세 정보를 남겨 디버깅에 활용
    console.error(`[Error Log] ${new Date().toISOString()}:`, err.stack);
    
    // 클라이언트에게는 구체적인 DB 구조나 에러 코드를 숨김
    res.status(500).json({
        error: "Internal Server Error",
        message: "요청을 처리하는 중 문제가 발생했습니다. 관리자에게 문의하세요."
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
