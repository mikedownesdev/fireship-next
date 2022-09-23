import Head from 'next/head';

/**
 * 
 * @param {Object} props
 * @param {string} props.title;
 * @param {string} props.name;
 * @param {string} props.email
 */
export default function Metatags({
  title = 'The Full Next.js + Firebase Course',
  description = 'A complete Next.js + Firebase course by Fireship.io',
  image = 'https://fireship.io/courses/react-next-firebase/img/featured.png',
}) {
  return (
    /**
     * The HEAD component will automatically update the head
     * of the html document when the page is rendered
     */
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@fireship_dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}