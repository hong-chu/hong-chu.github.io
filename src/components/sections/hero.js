import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 100vh;
  padding: var(--nav-height) 20px 0;

  @media (max-height: 700px) and (min-width: 700px),
    (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${props => props.theme.mixins.bigButton};
    margin-top: 50px;
  }

  .highlight-green {
    color: var(--green);
    font-weight: bold;
  }

  .highlight-blue {
    color: #3366cc;
    font-weight: bold;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hey there! I'm</h1>;
  const two = <h2 className="big-heading">Hong Chu</h2>;
  const three = <h3 className="medium-heading">Quant | Data | Crypto</h3>;
  const four = (
    <div>

	<p>
	  I'm a full-stack Data Scientist and ex-Quant Researcher with 10 years of experience turning data into strategies.
	</p>

	<p>
  	Known as the go-to problem solver on every team I've joined, I see both the forest and the trees. I'm also a quick learner who’s always open to new tools and ideas, learns systematically, and finds smarter ways to work.
	</p>

    </div>
  );

  const five = (
    <a
      className="email-link"
      href="https://chandrikadeb7.gumroad.com"
      target="_blank"
      rel="noreferrer">
      Check out my products!
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
