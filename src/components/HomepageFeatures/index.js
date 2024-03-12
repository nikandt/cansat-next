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
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        CanSat NeXT is distributed internationally at <a href="https://holvi.com/shop/kitsat/section/cansat/" target="_blank">Holvi</a> by Spacelab Nextdoor Inc., and through <a href="https://www.esero.fi/cansat" target="_blank">ESERO Finland</a>.
      </>
    ),
    buttontext: (
      <>
        Buy CanSat NeXT
      </>
    ),
    destlink: (
        "https://holvi.com/shop/kitsat/section/cansat/"
    )
  },
  {
    title: 'Build your own projects',
    Icon: faProjectDiagram,
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
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
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
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