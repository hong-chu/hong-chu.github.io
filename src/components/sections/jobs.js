// src/components/sections/Jobs.js

import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 700px;

  .inner {
    display: flex;
    @media (max-width: 600px) {
      display: block;
    }
  }
`;

const StyledTabList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledTabButton = styled.button`
  background: none;
  border: none;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;     /* 👈 Prevent line break */
  width: auto;             /* 👈 Don’t force full width */
  display: inline-block;   /* 👈 Optional: keeps button compact */
`;


const StyledTabPanels = styled.div`
  width: 100%;
  margin-left: 20px;
  margin-top: 40px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  h3 {
    font-size: var(--fz-lg);
    font-weight: 600;

    .company {
      color: var(--green);
      margin-left: 8px;
    }
  }

  .range {
    font-size: var(--fz-xs);
    font-family: var(--font-mono);
    color: var(--light-slate);
    margin-bottom: 12px;
  }

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }
`;

const StyledText = styled.div`
  .highlight-green {
    color: var(--green);
    font-weight: bold;
  }

  p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
`;

const Jobs = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              company
              location
              range
              url
            }
            html
            fileAbsolutePath
          }
        }
      }
    }
  `);

  const jobsData = data.jobs.edges.map(edge => {
    const node = edge.node;
    const match = node.fileAbsolutePath.match(/content\/jobs\/([^/]+)\//);
    const folderType = match ? match[1] : 'Other';
    return {
      frontmatter: node.frontmatter,
      html: node.html,
      type: folderType,
    };
  });

  const groupedJobs = jobsData.reduce((acc, job) => {
    const { type } = job;
    if (!acc[type]) acc[type] = [];
    acc[type].push(job);
    return acc;
  }, {});

  const jobTypes = Object.keys(groupedJobs);
  const [activeTabId, setActiveTabId] = useState(0);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, [prefersReducedMotion]);

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Experience</h2>

      <StyledText>
        <p>
          I’m currently the <span className="highlight-green">Lead Product Data Scientist</span> at{' '}
          <span className="highlight-green">OKX</span>, the world’s second‐largest crypto exchange, where I lead global onshore product analytics.
        </p>
        <p>
          I support all core product functions, report directly to the{' '}
          <span className="highlight-green">VP of Product</span>, and collaborate closely with engineering, business, product, and design teams to deliver insights across the entire product lifecycle.
        </p>
        <p>
          My strong business sense and deep understanding of crypto trading come from my prior experience as a{' '}
          <span className="highlight-green">Quant Researcher / Portfolio Manager</span> at hedge funds, where I managed{' '}
          <span className="highlight-green">$30M</span> in algorithmic trading portfolios powered by proprietary strategies I developed.
        </p>
      </StyledText>

      <div className="inner">
        <StyledTabList>
          {jobTypes.map((type, i) => (
            <li key={i}>
              <StyledTabButton isActive={i === activeTabId} onClick={() => setActiveTabId(i)}>
                {type}
              </StyledTabButton>
            </li>
          ))}
        </StyledTabList>

        <StyledTabPanels>
          {jobTypes.map((type, i) => (
            <CSSTransition
              key={type}
              in={activeTabId === i}
              timeout={250}
              classNames="fade"
              unmountOnExit>
              <StyledTabPanel>
                {groupedJobs[type].map((job, idx) => {
                  const { title, company, url, range } = job.frontmatter;
                  return (
                    <div key={idx} style={{ marginBottom: '3rem' }}>
                      <h3>
                        {title}
                        <span className="company">
                          &nbsp;@&nbsp;
                          <a className="inline-link" href={url} target="_blank" rel="noreferrer">
                            {company}
                          </a>
                        </span>
                      </h3>
                      <p className="range">{range}</p>
                      <div dangerouslySetInnerHTML={{ __html: job.html }} />
                    </div>
                  );
                })}
              </StyledTabPanel>
            </CSSTransition>
          ))}
        </StyledTabPanels>
      </div>
    </StyledJobsSection>
  );
};

export default Jobs;
