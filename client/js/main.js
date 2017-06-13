import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import '../index.html';

window.onload = () => {
    ReactDOM.render(
        <App />,
        document.getElementById('main')
    );
};

