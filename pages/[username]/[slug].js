import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import AuthCheck from '../../components/AuthCheck'
import HeartButton from "../../components/HeartButton";
import Link from 'next/link'
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';

/**
 * CONCEPT: SSG, ISR
 * 
 * We want individual blog post pages to be SSG, or 
 * server side generated. This means that blog post HTML
 * files will be constructed at BUILD time, giving the
 * user a very fast UX and, because it is server side
 * like SSR, SEO and Linkbot performance is optimized, too.
 * 
 * 
 * To pre-render a page, or implement STATIC GENERATION
 * we use the getStaticProps function which tells Next.js
 * to fetch data here on the server at BUILD time in 
 * order to pre-render this page in advance
 * 
 */
export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug)
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  }
}

/**
 * 
 * However, we are not finished. When we build our site
 * Next.js will see that it has some pages it will need
 * to pre-render. 
 * 
 * But how many? Which ones? Next don't know!
 * 
 * We can tell Next.js which paths to render with the
 * getStaticPaths function. 
 * 
 * So here we'll query ALL of the posts in our DB, since
 * we want to SSG+ISR all posts. Then we'll map them down
 * into objects and call them "paths" since the paths indeed
 * are [username]/[slug]
 * 
 * But there's one more thing to know, see line 76.
 */
export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
    /**
     * Now at this point, we've indicated to Next.js
     * that at BUILD time, we want to pre-render any and
     * all of the paths that we returned from our
     * getStaticProps function.
     * 
     * Great; Build, Pre-render, Hoorah!
     * 
     * With traditional SSG, Next.js would have no way
     * of knowing when a NEW post (path) was added to the
     * database. So if you tried to load this new post,
     * (www.myapp.com/donaldduck/donnys-new-post), it would
     * not be found and you'd receive a 404 instead!
     * 
     * However, adding a fallback value of "blocking":
     * 
     * When a user tries to access a page that has not been
     * rendered yet, it tells Next.js to "fallback" to SSR.
     * Once it renders the page, then it can be cached on the
     * CDN for the next person, like all the other pages.
     * 
     * That's really awesome, because otherwise you would need
     * to REBUILD(!) your entire site with regular SSG. This
     * would be very inefficient if you have a really big site
     * with lots of content
     */
  };
}


export default function Post(props) {
  const postRef = firestore.doc(props.path);

  /**
   * useDocumentData is a react-firebase hook that provides
   * a feed of that data in realtime
   */
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef}></HeartButton>
        </AuthCheck>

      </aside>
    </main>
  );
}