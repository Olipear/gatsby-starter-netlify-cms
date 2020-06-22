import React from "react";
import { graphql, StaticQuery } from "gatsby";
import ProjectTile from "../projects/ProjectTile";


// array to determine how many tiles per row to place
const tileLayouts = [
  // one stretched
  [{ parent: [0] }],
  // two side by side
  [{ parent: [0, 1] }],
  // two atop on left, one streched vertically right
  [{ parentV: [0, 1] }, { parent: [2] }],
  //one streched on first row, second row as with 3
  [
    {
      parentV: [
        { parent: [0] },
        { parent: [{ parentV: [1, 3] }, { parent: [2] }] },
      ],
    },
  ],
  // two on first row, three on second row
  [{ parent: [0, 1] }, { parent: [2, 3, 4] }],
];

const ProjectRoll = ({data}) => {
  const {edges: projects} = data.allMarkdownRemark;

  const buildProjectTiles = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((projectIndex) => {
        return (
          <ProjectTile
            key={projects[projectIndex].node.id}
            project={projects[projectIndex].node}
          />
        )
      });
    } else {
      return obj.map((container) => {
        return (buildProjectGrid(container));
      });
    }
  };

  const buildProjectGrid = (obj) => {
    if (obj.hasOwnProperty("parentV")) {
      return <div className="tile is-parent is-vertical">{buildProjectTiles(obj.parentV)}</div>;
    } else {
      return (
        <div className="tile is-parent">{buildProjectTiles(obj.parent)}</div>
      );
    }
  };
  console.log(projects)
  if (projects.length > 0) {
    return (
      <section className="section double-padded" id="projects">
          <div className="container">
            <div className="tile is-ancestor">
              {projects.length &&
                tileLayouts[Math.min(projects.length - 1, 4)].map((layout) => buildProjectGrid(layout))}
            </div>
          </div>
        </section>
    );
  } else {
    return null
  }
};

export default () => (
  <StaticQuery
    query={graphql`
    query ProjectRollQuery {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: { frontmatter: { templateKey: { eq: "project-entry" }, featuredproject: {eq: true} } }
      ) {
        edges {
          node {
            excerpt(pruneLength: 400)
            id
            fields {
              slug
            }
            frontmatter {
              title
              templateKey
              date(formatString: "MMMM DD, YYYY")
              featuredimage {
                childImageSharp {
                  fluid(maxWidth: 650, maxHeight: 650, quality: 100) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              description
            }
          }
        }
      }
    }
  `}
    render={(data) => <ProjectRoll data={data}/>}
  />
  )
