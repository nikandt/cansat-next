import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

import cansatImage from '../img/cansat.png';
import heroImage from '../img/hero.JPG';
import Translate, {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img src={cansatImage} alt="CanSat" className={styles.cansatImage} />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.tagline" description="Homepage tagline">
            {siteConfig.tagline}
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/landing">
            <Translate id="homepage.goToDocs" description="Homepage 'Go to Documentation' button">
              Go to Documentation
            </Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={translate({
        id: 'homepage.title',
        message: 'Welcome to CanSat NeXT!',
        description: 'Homepage <title> element',
      })}
      description={translate({
        id: 'homepage.description',
        message: 'CanSat NeXT is an Arduino-based rocket payload simulator and development board. It is developed for CanSat competitions in collaboration with ESERO Finland and Spacelab Nextdoor Inc.',
        description: 'Homepage <meta> description',
      })}>
      <HomepageHeader />
      <main>
        <div className={styles.info}>
          <div className={clsx('col col--6')}>
            <div className="text--center">
              <p>
                <Translate id="homepage.intro" description="Introductory paragraph">
                  CanSat NeXT is an Arduino-based rocket payload simulator and development board. It is developed for CanSat competitions in collaboration with ESERO Finland and Spacelab Nextdoor Inc.
                </Translate>
              </p>
              <br />
              <p>
                {translate(
                  {
                    id: 'homepage.gettingStarted',
                    message:
                      'Check out the {link} section for further information, including how to set up the kit.',
                    description: 'Text with link to the Getting Started docs',
                  },
                  {
                    link: <Link to="/docs/course/lesson1">Getting started</Link>,
                  }
                )}
              </p>
              <p>
                {translate(
                  {
                    id: 'homepage.esaLink',
                    message:
                      'For more information about the CanSat initiative, please visit {esa}.',
                    description: 'Link to ESA CanSat website',
                  },
                  {
                    esa: (
                      <a href="https://cansat.esa.int/" target="_blank" rel="noopener noreferrer">
                        https://cansat.esa.int/
                      </a>
                    ),
                  }
                )}
              </p>
            </div>
          </div>
        </div>
        <HomepageFeatures />
      </main>
      <div className={styles.heroImageContainer}>
        <img src={heroImage} alt="Students launching CanSat" />
      </div>
    </Layout>
  );
}
