import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import AutorBox from './Autor';
import Home from './Home';
import LivroBox from './Livro'

ReactDOM.render(
    (<BrowserRouter>  

        <App>
            <Route path="/" exact component={Home}/>
            <Route path="/autor" exact component={AutorBox}/>
            <Route path="/livro" exact component={LivroBox}/>
        </App>
    
    </BrowserRouter>),
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

