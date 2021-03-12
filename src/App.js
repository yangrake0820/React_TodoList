import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import home from './components/home/home';
import Main from './components/main/Main';

const App = () => {
    return (
        <>
            <Route path="/" exact component={Main} />
            <Route path="/test" component={home} />
        </>
    );
};

export default App;
