# 설치

```
$ docker container run -d -p 3306:3306 	\
-e MYSQL_ROOT_PASSWORD=1234 		\
-v /Users/Shared/happy/mariadb:/var/lib/mysql 	\
--name mariadb mariadb
```

# 실행확인

```
$ docker container ls -as
```

# 접속

```
$ docker exec -i -t mariadb bash
$ mysql -uroot -p1234
```

[참고] https://happygrammer.github.io/docker/mariadb/
