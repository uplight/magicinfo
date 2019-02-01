
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

import axios from 'axios';




function loadLoginPage(Cookie) {
  const url = 'http://35.182.202.246:7001/MagicInfo/login.htm?cmd=INIT';

  axios({
    url,
    method: 'GET',
    headers: {
      Cookie
    }
  }).then(result => {

    console.log('security resilt', result.data);

  }).catch(console.error);

  axios.get(url).then(response => {
    console.log(response.data);
  });
}


loadLoginPage('JSESSIONID=2676C3B4D312CAE83397B4DC77CE9D88');


/*
axios.get('http://35.182.202.246:7001/MagicInfo/').then(response => {
 // console.log(response.data);
  const html = response.data;
  const headers = response.headers;
  const Cookie = headers['set-cookie'].toString();
  console.log(Cookie);

  let token = html.substr(html.indexOf('var token'), 100);
  console.log(token);
  const start = token.indexOf('value=') + 7;

  token = token.substring(start, token.indexOf('"', start + 2));

  console.log(token);


  let url = 'http://35.182.202.246:7001/MagicInfo/j_spring_security_check';

  axios({
    url,
    method: 'POST',
    data: {
      j_username: 'AEBAdmin',
      j_password: 'X0lWCj4wNmTbVrluF0IJ',
      _csrf: token
    },
    headers: {
      Cookie
    }
  }).then(result => {

    console.log('security resilt', result.data);

  }).catch(console.error);



});
*/



/*
JSDOM.fromURL('http://35.182.202.246:7001/MagicInfo/'
  // { runScripts: 'dangerously' }
  ).then(dom => {
  // console.log(dom.serialize());
  setTimeout(() => {
    const html = dom.window.document.documentElement.innerHTML;
    const headers = dom.window.document.head;
    console.log(headers);
    let token = html.substr(html.indexOf('var token'), 100);
    console.log(token);
    const start = token.indexOf('value=') + 7;

    token = token.substring(start, token.indexOf('"', start + 2));

    console.log(token);




    // console.log(dom.window.document.documentElement.innerHTML);
// var token = $('<input type="hidden" value="b933520f-6e8c-4c01-8dfc-640d1ef990e1" name="_csrf">');

  }, 1000);
});
*/
