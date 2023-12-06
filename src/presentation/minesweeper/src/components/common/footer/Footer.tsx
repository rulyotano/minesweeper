import React from "react";
import GitHubIcon from "@material-ui/icons/GitHub";
import styles from "./styles";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(styles);

const Footer: React.FunctionComponent<FooterProps> = (props: FooterProps) => {
  const classes = useStyles();

  return <div className={classes.footer}>
    <div>Made with&nbsp;<span role="img" aria-label="love">❤️</span>&nbsp;by&nbsp;<a href="https://rulyotano.com" target="_blank" rel="noopener noreferrer">rulyotano</a></div>
    <div><GitHubIcon className={classes.icon} /> Can find &nbsp;<a href="https://github.com/rulyotano/minesweeper" target="_blank" rel="noopener noreferrer">the Github repo here!</a></div>
    <div>Tech used so far:</div>
    <div className={classes.tech}>
      <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
      <img src="https://img.shields.io/badge/-ReactJS-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="ReactJS" />
      <img src="https://img.shields.io/badge/-Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
      <img src="https://img.shields.io/badge/-Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="Materia UI" />
      <img src="https://img.shields.io/badge/-.NET-512BD4?style=for-the-badge&logo=.net&logoColor=white" alt=".NET" />
      <img src="https://img.shields.io/badge/-C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#" />
      <img src="https://img.shields.io/badge/-Docker%20Swarm-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Swarm" />
      <img src="https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
      <img src="https://img.shields.io/badge/-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
      <img src="https://img.shields.io/badge/-Traefix%20Proxy-24A1C1?style=for-the-badge&logo=traefikproxy&logoColor=white" alt="Traefik Proxy" />
      <img src="https://img.shields.io/badge/-Apache-D22128?style=for-the-badge&logo=apache&logoColor=white" alt="Apache" />
      <img src="https://img.shields.io/badge/-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
      <img src="https://img.shields.io/badge/-Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white" alt="Auth0" />
    </div>
  </div>;
};

interface FooterProps {
  someProp?: string;
}

export default React.memo(Footer);
