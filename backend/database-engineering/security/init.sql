-- 1. 테이블 생성
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- 2. 역할(Role) 생성 (기능별 전용 사용자)
CREATE USER dbread WITH PASSWORD 'password_read';
CREATE USER dbcreate WITH PASSWORD 'password_create';
CREATE USER dbdelete WITH PASSWORD 'password_delete';

-- 3. 권한 부여 (Principle of Least Privilege)

-- 모든 사용자에게 public 스키마 사용 권한 부여
GRANT USAGE ON SCHEMA public TO dbread, dbcreate, dbdelete;

-- Read 전용: SELECT만 가능
GRANT SELECT ON users TO dbread;

-- Create 전용: INSERT 가능 + RETURNING id를 위한 SELECT 권한 + SERIAL 시퀀스 사용 권한
GRANT INSERT, SELECT ON users TO dbcreate;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO dbcreate;

-- Delete 전용: DELETE + 식별 및 RETURNING을 위한 SELECT 가능
GRANT SELECT, DELETE ON users TO dbdelete;
