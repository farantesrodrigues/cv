import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={styles.container}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p style={styles.message}>
        The page you’re looking for doesn’t exist or may have been removed.
      </p>
      <Link href="/" style={styles.link}>
        Go back to Home
      </Link>
      <style jsx>{`
        a {
          color: #0070f3;
          text-decoration: underline;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  message: {
    color: '#555',
    fontSize: '1rem',
    margin: '1rem 0',
  },
  link: {
    fontSize: '1rem',
    color: '#0070f3',
    textDecoration: 'underline',
  },
};
