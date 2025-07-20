import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faShoppingCart, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';

import Translate, { translate } from '@docusaurus/Translate';

const FeatureList = [
  {
    title: translate({ id: 'homepage.buy.title', message: 'Where to Buy' }),
    Icon: faShoppingCart,
    description: (
      <Translate
        id="homepage.buy.description"
        values={{
          link: (
            <a
              href="https://spacelabnextdoor.com/electronics/20-cansat-next"
              target="_blank"
            >
              Spacelab Nextdoor
            </a>
          ),
        }}
      >
        {
          'CanSat NeXT is distributed internationally at {link}, and through local ESERO offices.'
        }
      </Translate>
    ),
    buttontext: (
      <Translate id="homepage.buy.button">Buy CanSat NeXT</Translate>
    ),
    destlink: 'https://spacelabnextdoor.com/electronics/20-cansat-next',
  },
  {
    title: translate({ id: 'homepage.projects.title', message: 'Build your own projects' }),
    Icon: faProjectDiagram,
    description: (
      <Translate
        id="homepage.projects.description"
        values={{
          github: (
            <a
              href="https://github.com/netnspace/CanSatNeXT_library"
              target="_blank"
            >
              GitHub
            </a>
          ),
          blog: <a href="/blog" target="_blank">Blog</a>,
        }}
      >
        {
          'Download the CanSat NeXT Arduino library from the Arduino library manager or clone from {github}. Find inspiration for your own projects from our CanSat {blog}.'
        }
      </Translate>
    ),
    buttontext: <Translate id="homepage.projects.button">To Blog</Translate>,
    destlink: '/blog',
  },
  {
    title: translate({ id: 'homepage.spaceplace.title', message: 'Stay posted' }),
    Icon: faSatelliteDish,
    description: (
      <Translate
        id="homepage.spaceplace.description"
        values={{
          spaceplace: (
            <a
              href="https://arcticastronautics.fi/spaceplace"
              target="_blank"
            >
              Spaceplace
            </a>
          ),
        }}
      >
        {
          'Learn about what is going on in Space at {spaceplace}.'
        }
      </Translate>
    ),
    buttontext: (
      <Translate id="homepage.spaceplace.button">Explore Spaceplace</Translate>
    ),
    destlink: 'https://arcticastronautics.fi/spaceplace',
  },
];

function Feature({ title, description, buttontext, destlink, Icon }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <FontAwesomeIcon icon={Icon} className={styles.featureSvgIcon} size="lg" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link className="button button--secondary button--lg" to={destlink}>
          {buttontext}
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
