# Dynamic Routes

```
Defining routes by using predefined paths is not always enough for complex applications.
In Next.js you can add brackets to a page ([param]) to create a dynamic route (a.k.a. url slugs, pretty urls, and others).

Consider the following page pages/post/[pid].js:
```

```
import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query

  return <p>Post: {pid}</p>
}

export default Post
```

```
Any route like /post/1, /post/abc, etc. will be matched by pages/post/[pid].js.
The matched path parameter will be sent as a query parameter to the page, and it will be merged with the other query parameters.
```

# Implement getStaticPaths

```
If a page has dynamic routes (documentation) and uses getStaticProps
it needs to define a list of paths that have to be rendered to HTML at build time.

If you export an async function called getStaticPaths from a page that uses dynamic routes,
Next.js will statically pre-render all the paths specified by getStaticPaths.
```

# Development v.s. Production

```
In development (npm run dev or yarn dev), getStaticPaths runs on every request.
In production, getStaticPaths runs at build time.
```

# Fallback

```
Recall that we returned fallback: false from getStaticPaths. What does this mean?

If fallback is false, then any paths not returned by getStaticPaths will result in a 404 page.

If fallback is true, then the behavior of getStaticProps changes:

The paths returned from getStaticPaths will be rendered to HTML at build time.
The paths that have not been generated at build time will not result in a 404 page.
Instead, Next.js will serve a “fallback” version of the page on the first request to such a path.

In the background, Next.js will statically generate the requested path.
Subsequent requests to the same path will serve the generated page, just like other pages pre-rendered at build time.

If fallback is blocking, then new paths will be server-side rendered with getStaticProps, and cached for future requests so it only happens once per path.

This is beyond the scope of our lessons, but you can learn more about fallback: true and fallback: 'blocking' in the fallback documentation.
```

# More about data fetching

https://nextjs.org/docs/basic-features/data-fetching
