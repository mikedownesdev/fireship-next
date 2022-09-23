import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

/**
 * What's really nice about this is that any components 
 * that we use inside of the Auth check will be guaranteed
 * to have access to the current user and it's context
 */

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username ? props.children : props.fallback || <Link href="/enter">You must be signed in</Link>;
}