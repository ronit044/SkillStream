import React from "react";
import "./Footer.css";

const Footer = () => {
  const githubHref = () => {
    window.open("https://github.com/mptapasdas/freedemy", "_blank");
  };
  return (
    <div className='footer-container'>
      <p className='made-by'>A project by Ronit Sharma</p>
      <i className='fab fa-github github-icon' onClick={githubHref}></i>
    </div>
  );
};

export default Footer;
