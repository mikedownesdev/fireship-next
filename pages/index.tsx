import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

import Loader from '../components/Loader';

import toast from 'react-hot-toast'

export default function Home() {
  return (
    <div>
      <button onClick={() => toast.success('hello toast!')}>
        Toast
      </button>
    </div>

    // <div>
    //   <Loader show />
    // </div>

    // <div>
    //   <Link prefetch={true} href={{
    //       pathname: '/[username]',
    //       query: { username: 'mikedownesdev'}
    //     }}>
    //     <a>Mike's Profile</a>
    //   </Link>
    // </div>
  )
}
