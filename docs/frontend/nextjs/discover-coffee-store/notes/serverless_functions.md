# [serverless function](https://blog.hubspot.com/website/serverless-functions)

```
user request
=> event has occurred
=> serverless function /api/hello (server is sleeping...)
=> starts wake up and starts server
=> /api/hello executing...
=> execution complete
=> server shutsdown
```

## nextjs api routes

### rules

- file needs to be a function
- function needs to be exported by default
- every function should be it's own file
