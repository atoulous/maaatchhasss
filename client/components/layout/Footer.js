import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <footer>
    <hr />
    <div className={'container text-center'}>
      <div className={'row'}>
        <div className={'col'}>
      This app was made by
          <Link to="http://github.com/atoulous" target="_blank" title="Aymeric Toulouse">
            <strong> atoulous </strong></Link>
      with <strong>React</strong> and <strong>Express</strong>.
        </div>
      </div>
    </div>
  </footer>
);
