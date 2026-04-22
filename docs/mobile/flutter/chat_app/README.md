# chat_app

## Set up

1. firebase set up
   [link](https://firebase.google.com/docs/flutter/setup?hl=ko&platform=ios#install-cli-tools)

2. firebase authentication 이메일/비밀번호 사용 설정

3. firebase storage 보안규칙 설정
   [link](https://firebase.google.com/docs/rules/get-started?hl=ko&authuser=0&_gl=1*6l9jqy*_ga*MTgxMzk3NjE2OS4xNjg1NjE4NDE2*_ga_CW55HF8NVT*MTY4NTYyMjMxNS4yLjEuMTY4NTYyMjUwNy4wLjAuMA..)

   ```text
   rules_version = '2';

   // Craft rules based on data in your Firestore database
   // allow write: if firestore.get(
   //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
   service firebase.storage {
   match /b/{bucket}/o {
      match /{allPaths=**} {
         allow read, write: if request.auth != null;
      }
   }
   }
   ```

4. 위와 같이 firestore database도 설정

5. 푸시 노티피케이션 - firebase cloud messaging 설정
   [link](https://firebase.google.com/docs/cloud-messaging/flutter/client?hl=ko)

6. firebase function 배포 - chat 토픽으로 notification 전송
   [link](https://firebase.google.com/docs/functions/get-started?authuser=0&hl=ko)
