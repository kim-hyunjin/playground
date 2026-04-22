# Two Forms of Pre-rendering

```
Next.js has two forms of pre-rendering: Static Generation and Server-side Rendering. The difference is in when it generates the HTML for a page.

Static Generation is the pre-rendering method that generates the HTML at build time. The pre-rendered HTML is then reused on each request.
Server-side Rendering is the pre-rendering method that generates the HTML on each request.
```

```
In development mode (when you run npm run dev or yarn dev), every page is pre-rendered on each request — even for pages that use Static Generation.
```

# Static Generation with Data using getStaticProps

```
How does it work? Well, in Next.js, when you export a page component, you can also export an async function called getStaticProps. If you do this, then:

getStaticProps runs at build time in production, and…
Inside the function, you can fetch external data and send it as props to the page.

Essentially, getStaticProps allows you to tell Next.js: “Hey, this page has some data dependencies — so when you pre-render this page at build time, make sure to resolve them first!”
```

```
Note: In development mode, getStaticProps runs on each request instead.
```

# Fetching Data at Request Time

```
If you need to fetch data at request time instead of at build time, you can try Server-side Rendering.

To use Server-side Rendering, you need to export getServerSideProps instead of getStaticProps from your page.

export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    }
  }
}
```

# Fetching data on the client side

```
If your page contains frequently updating data, and you don’t need to pre-render the data, you can fetch the data on the client side. An example of this is user-specific data. Here’s how it works:

First, immediately show the page without data. Parts of the page can be pre-rendered using Static Generation. You can show loading states for missing data.
Then, fetch the data on the client side and display it when ready.
This approach works well for user dashboard pages, for example. Because a dashboard is a private, user-specific page, SEO is not relevant and the page doesn’t need to be pre-rendered. The data is frequently updated, which requires request-time data fetching.
```

# SWR

The team behind Next.js has created a React hook for data fetching called SWR. We highly recommend it if you’re fetching data on the client side. It handles caching, revalidation, focus tracking, refetching on interval, and more. And you can use it like so:

```
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

https://swr.vercel.app/ko
