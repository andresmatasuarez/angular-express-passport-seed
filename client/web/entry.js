import './stylesheets/app.less';
import './javascripts/app';

import mainTemplate from './main.jade';

const div = document.createElement('div');
div.innerHTML = mainTemplate;
document.body.appendChild(div.firstChild);
