# pdf app 실행하기
```
pdf-app 폴더로 이동
$ pipenv shell
$ pipenv install
$ redis-server
$ inv dev
$ inv devworker

local-do-files 폴더로 이동
$ pipenv shell
$ pipenv install
$ python main.py

langfuse 실행하기
# Clone the Langfuse repository
git clone https://github.com/langfuse/langfuse.git
cd langfuse
 
# Start the server and database
docker compose up
```