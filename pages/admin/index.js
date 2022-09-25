import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';



export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')

  const query = ref.orderBy('createdAt');
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map((doc) => doc.data())

  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={posts} admin />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext)

  const [title, setTitle] = useState('')

  /**
   * Take the typed input and change it kebab case,
   * then ensure it is URI safe wit the built-in
   * encodeURI() method.
   * 
   * The title is valid if it is longer than 3 and less than 100 chars
   */
  const slug = encodeURI(kebabCase(title))
  const isValid = title.length > 3 && title.length < 100; 

  const createPost = async (e) => {
    e.preventDefault(); // Don't refresh the page

    /**
     * Grab the user id and make a reference to the user's posts
     * 
     * Re: .doc(slug) --> Because we don't want this soon-to-be new document's 
     * ID to be automatically generated, we can make the reference to a 
     * document that doesn't exist yet with the value of {{slug}} as the ID
     */
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection('users').doc(uid)
      .collection('posts').doc(slug)

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# Title",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0
    }

    // Commit data to storage (firestore)
    await ref.set(data)

    /* Let the user know the commit was succesful and navigate to the new
    /admin/[slug] page for editing */
    toast.success('Post created!')
    router.push(`/admin/${slug}`)
  }

  return (
    <form onSubmit={createPost}>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My New Post"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}