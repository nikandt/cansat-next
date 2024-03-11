import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const FeatureList = [

  {
    title: 'Build your own projects',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Find inspiration for your own projects from our CanSat Blog.
      </>
    ),
    buttontext: (
      <>
        To Blogs
      </>
    ),
    destlink: (
        "/blog"
    )
  },
  {
    title: 'Where to Buy',
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
    title: 'Stay posted',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Learn about what is going on in Space at Spaceplace.
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

function Feature({Svg, title, description, buttontext, destlink}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
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
