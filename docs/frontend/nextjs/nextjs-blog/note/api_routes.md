# API routes

```
API routes provide a solution to build your API with Next.js.

Any file inside the folder pages/api is mapped to /api/* and will be treated as an API endpoint instead of a page.

They are server-side only bundles and won't increase your client-side bundle size.

For example, the following API route pages/api/user.js returns a json response with a status code of 200:

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

```
For an API route to work, you need to export a function as default (a.k.a request handler), which then receives the following parameters:

req: An instance of http.IncomingMessage, plus some pre-built middlewares
res: An instance of http.ServerResponse, plus some helper functions
To handle different HTTP methods in an API route, you can use req.method in your request handler, like so:

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

## Do Not Fetch an API Route from getStaticProps or getStaticPaths

```
You should not fetch an API Route from getStaticProps or getStaticPaths.
Instead, write your server-side code directly in getStaticProps or getStaticPaths (or call a helper function).

Here’s why: getStaticProps and getStaticPaths runs only on the server-side.
It will never be run on the client-side.
It won’t even be included in the JS bundle for the browser.
That means you can write code such as direct database queries without them being sent to browsers.
```

## A Good Use Case: Handling Form Input

```
A good use case for API Routes is handling form input.
For example, you can create a form on your page and have it send a POST request to your API Route.
You can then write code to directly save it to your database.
The API Route code will not be part of your client bundle, so you can safely write server-side code.
```
