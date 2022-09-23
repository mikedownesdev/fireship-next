import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/PostFeed'
import { postToJSON, getUserWithUsername } from '../../lib/firebase'

// NOTE: This will automatically fire on the server anytime the page is requested

// The function needs to return an object with a that has a props value with
// that contains the properties, like user and post (seen here), that we want
// to send back to the component
export async function getServerSideProps({ query }) {
  const { username } = query

  const userDoc = await getUserWithUsername(username)

  // Short circuit 
  if (!userDoc) { return { notFound: true } }

  //JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data()
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)


    // NOTE: Because this is a server rendered Next.js page, the timestamp
    // values from the document need to be serialized into either a number
    // or a string
    posts = (await postsQuery.get()).docs.map(postToJSON)
  }

  return {
    props: { user, posts } // will be passed to the page component as props
  }
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user = { user } />
      <PostFeed posts = { posts } /> 
    </main>
  )
}