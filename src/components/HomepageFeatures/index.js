import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faShoppingCart, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';


const FeatureList = [

  {
    title: 'Where to Buy',
    Icon: faShoppingCart,
    description: (
      <>
        CanSat NeXT is distributed internationally at <a href="https://spacelabnextdoor.com/electronics/20-cansat-next" target="_blank">Spacelab Nextdoor</a>, and through local ESERO offices.
      </>
    ),
    buttontext: (
      <>
        Buy CanSat NeXT
      </>
    ),
    destlink: (
        "https://spacelabnextdoor.com/electronics/20-cansat-next"
    )
  },
  {
    title: 'Build your own projects',
    Icon: faProjectDiagram,
    description: (
      <>
        Download the CanSat NeXT Arduino library from the Arduino library manager or clone from <a href="https://github.com/netnspace/CanSatNeXT_library" target="_blank">GitHub</a>.
        Find inspiration for your own projects from our CanSat <a href="/blog" target="_blank">Blog</a>.
      </>
    ),
    buttontext: (
      <>
        To Blog
      </>
    ),
    destlink: (
        "/blog"
    )
  },
  {
    title: 'Stay posted',
    Icon: faSatelliteDish,
    description: (
      <>
        Learn about what is going on in Space at <a href="https://arcticastronautics.fi/spaceplace" target="_blank">Spaceplace</a>.
      </>
    ),
    buttontext: (
      <>
        Explore Spaceplace
      </>
    ),
    destlink: (
        "https://arcticastronautics.fi/spaceplace"
    )
  },
];

function Feature({title, description, buttontext, destlink, Icon}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <FontAwesomeIcon icon={Icon} className={styles.featureSvgIcon} size="lg" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
          <Link
            className="button button--secondary button--lg"
            to={destlink}>
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
