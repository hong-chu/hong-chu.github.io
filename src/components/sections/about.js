import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

// ─── 1) IMPORT FIVE PHOTOS ───────────────────────────────────────────────────────
// Make sure you have me1.jpg … me5.jpg in your src/images folder
import photo1 from '../../images/me1.jpg';
import photo2 from '../../images/me2.jpg';
import photo3 from '../../images/me3.jpg';
import photo4 from '../../images/me4.jpg';
import photo5 from '../../images/me5.jpg';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 4.5fr 2fr;
    grid-gap: 80px; /* INCREASED GAP BETWEEN TEXT & IMAGE */

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  .highlight-green {
    color: var(--green);
    font-weight: bold;
  }

  .outside-intro {
    margin-bottom: 6px;
  }

  .outside-list {
    margin-top: 0;
  }

  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 300px;
  cursor: pointer;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: transparent;

    /* ON HOVER: lift the entire stack and show green border */
    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
        opacity: 1;
      }
    }

    .img-stack {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: var(--border-radius);
      width: 100%;
      display: block;
      /* Remove any grayscale filter so images stay full-color always */
      filter: none;
      mix-blend-mode: normal;

      /* 2) FANCY TRANSITION: smooth translate/opacity/rotate */
      transition: transform 0.5s ease, opacity 0.5s ease;

      opacity: 1; /* always fully opaque */
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    /* Dark overlay behind the stack */
    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    /* Green border that appears on hover */
    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
      opacity: 0; /* hidden unless hovered */
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // ─── 3) SET UP STATE FOR 5 IMAGES ───────────────────────────────────────────────
  const images = [photo1, photo2, photo3, photo4, photo5];
  const [currentIndex, setCurrentIndex] = useState(0);

  // ─── 4) SCROLL REVEAL ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  // ─── 5) CLICK HANDLER TO ADVANCE INDEX (WRAP AROUND) ─────────────────────────────
  const handleImageClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };


  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        {/* ─── LEFT COLUMN: TEXT ─────────────────────────────────────────────────── */}
        <StyledText>
          <div>
	    <p><strong>Think in Numbers. Speak the Menu. </strong></p>
            <p>
              I started out with a background in <span className="highlight-green">Math and Financial Engineering</span>, and spent six years at hedge funds as a <span className="highlight-green">Quant Researcher</span>, and discovered a strong intuition for recognizing data patterns. Before I left, I successfully managed <span className="highlight-green">$30M</span> portfolios running trading strategies I built from scratch.
            </p>
            <p>
              After moving back to California from Shanghai for family, I pivoted into tech as a <span className="highlight-green">Data Scientist</span>, still applying my core strengths in analytics and modeling, now focused on user behaviors in <span className="highlight-green">crypto trading</span>, which I found equally fascinating. 
 	    </p>
            <p>
While continuing to apply my core strengths in analytics and modeling, I earned a part-time <span className="highlight-green">Master’s in Computer Science at UPenn</span> alongside a full-time job, upgrading my skills in data engineering, big data analytics, and AI.
            </p>

            <p className="outside-intro">
              <span className="highlight-green">Outside of work, I</span>
            </p>
            <ul className="outside-list">
              <li>play in two semi‐pro basketball leagues 🏀 (I'm a PF if you're curious!)</li>
              <li>am an ultimate foodie—from fine dining to street food 🍽️, and pursuing a French culinary certification 👨‍🍳</li>
              <li>have the cutest corgi ever 🐶🐾 and lovingly care for 17 neighborhood 🐱, who may or may not think they own me</li>
            </ul>

          </div>

        </StyledText>

        {/* ─── RIGHT COLUMN: CLICKABLE STACKED GALLERY ─────────────────────────────── */}
        <StyledPic>
          <div className="wrapper" onClick={handleImageClick}>
            {images.map((imgSrc, index) => {
              // offset = how “far behind” this image is relative to currentIndex
              const offset = (index - currentIndex + images.length) % images.length;
              // Larger overlap: 15px per offset
              const translateAmount = offset * 15;
              // Slight rotation for a bit more flair (±2° per offset)
              const rotation = (offset * 2) * (Math.PI / 180); // Convert degrees → radians in rotate()
              // Place the topmost image (offset=0) at highest z-index
              const zIndex = images.length - offset;

              return (
                <img
                  key={index}
                  className="img-stack"
                  src={imgSrc}
                  alt={`Headshot ${index + 1}`}
                  style={{
                    transform: `translate(${translateAmount}px, ${translateAmount}px) rotate(${offset * 2}deg)`,
                    zIndex,
                    opacity: 1, // always fully opaque
                  }}
                />
              );
            })}
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
