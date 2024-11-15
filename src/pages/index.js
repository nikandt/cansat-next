import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

import cansatImage from '../img/cansat.png';
import heroImage from '../img/hero.JPG';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img src={cansatImage} alt="CanSat" className={styles.cansatImage}/>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/landing">
            Go to Documentation
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
      title={`Welcome to CanSat NeXT!`}
      description="CanSat NeXT is an Arduino-based rocket payload simulator and development board. It is developed for CanSat competitions in collaboration with ESERO Finland and Spacelab Nextdoor Inc.">
      <HomepageHeader />
      <main>
        <div className={styles.info}>
          <div className={clsx('col col--6')}>
            <div className="text--center">
            CanSat NeXT is an Arduino-based rocket payload simulator and development board. It is developed for CanSat competitions in collaboration with ESERO Finland and Spacelab Nextdoor Inc.
            < br /><br />
            Check out the <a href="/docs/Intro/">Getting started</a> Section for further information, including how to Setup the kit.
            For more information about the CanSat initiative, please visit <a href="https://cansat.esa.int/">https://cansat.esa.int/</a>.
            </div>
          </div>
        </div>
        <HomepageFeatures></HomepageFeatures>
      </main>
      <div className={styles.heroImageContainer}>
      <img src={heroImage} alt="Your Hero Image Description" />
    </div>
    </Layout>
  );
}
