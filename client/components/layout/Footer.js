import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <footer>
    <div className="container text-center">
      This app was made by
      <Link to="http://github.com/atoulous" target="_blank" title="Aymeric Toulouse">
        <strong> atoulous </strong></Link>
      with <strong>React</strong> and <strong>Express</strong>.
    </div>
  </footer>
);
