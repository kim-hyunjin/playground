# rules

## storage

```text
rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
      request.resource.contentType.matches('audio/.*') &&
      request.resource.size < 10* 1024* 1024;
      allow delete: if request.auth != null;
    }
  }
}
```
