import styles from '../styles/Home.module.css';
import toast from 'react-hot-toast'
import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import { useState } from 'react';
import { firestore, postToJSON, fromMillis } from '../lib/firebase';

// Max post to query per page
const LIMIT = 1

// NOTE: This will automatically fire on the server anytime the page is requested

// The function needs to return an object with a that has a props value with
// that contains the properties, like user and post (seen here), that we want
// to send back to the component
export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts') // Grabs any sub-collection no matter where it's nested in the tree of documents
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { posts }
  }
}

export default function Home(props) {
  // NOTE: Different from /[username]/index.js, and interestingly,
  // We are using the props AS STATE, because we may want
  // to fetch additional posts in the future.
  // Notice how we're using the props rendered on the 
  // server as the inital value
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup('posts')
      .where("published", "==", true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)

    const newPosts = (await query.get()).docs.map((doc) => doc.data())

    setPosts(posts.concat(newPosts))
    setLoading(false)

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }
  
  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && "No more posts 👍"}
    </main>
  )
}
