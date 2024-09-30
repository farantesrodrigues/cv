import { useRouter } from 'next/router';
import Link from 'next/link';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locales, locale, asPath } = router;

  return (
    <div>
      {locales?.map((lng) => (
        <span key={lng}>
          <Link href={asPath} locale={lng}>
            <a className={lng === locale ? 'font-bold' : ''}>
              {lng.toUpperCase()}
            </a>
          </Link>{' '}
        </span>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
