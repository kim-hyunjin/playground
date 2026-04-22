INSERT INTO BOARD (board_id, title, writer, thumbnail, description, created_at) VALUES
    (1, '최애 F1팀', '김현진', 'https://e00-marca.uecdn.es/assets/multimedia/imagenes/2021/11/16/16370593936896.jpg', '2022 team 기준', now()),
    (2, '좋아하는 넷플릭스 드라마 월드컵', '김현진', 'https://t-mobile.scene7.com/is/image/Tmusprod/netflix-hero.desktop?wid=1280&hei=360&fmt=png-alpha', '', now());

INSERT INTO CONTENT (content_id, description, board_id) VALUES
    (1, 'Mercedes', 1),
    (2, 'Alpine', 1),
    (3, 'Red Bull Racing', 1),
    (4, 'Haas F1 Team', 1),
    (5, 'McLaren', 1),
    (6, 'Aston Martin', 1),
    (7, 'Ferrari', 1),
    (8, 'AlphaTauri', 1),
    (9, 'Alfa Romeo', 1),
    (10, 'Williams', 1);