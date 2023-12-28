const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const axios = require('axios');
const https = require('https');
const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
}, app);

const agent = new https.Agent({
  rejectUnauthorized: false
});
const username = 'admin';
const password = 'admin';
const basicAuthHeader = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

app.use(express.static(path.join(__dirname, '/public_html')));
app.use(bodyParser.json());
app.post('/configPortForward', (req, res) => {
    var endpointUrl = 'https://1.0.0.2/api/v1/firewall/nat/port_forward';
    var configuracionNueva = req.body;
    configuracionNueva['local-port'] = configuracionNueva.localPort;
   
    axios.post(endpointUrl, configuracionNueva, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuthHeader,
        },
        httpsAgent: agent
    })
    .then(response => {
        res.json({ success: true, data: response.data });
    })
    .catch(error => {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
}); 
app.post('/restartRouter', (req, res) => {
    var endpointUrl = 'https://1.0.0.2/api/v1/system/reboot';
    var foo = {foo: 0} 
    axios.post(endpointUrl,foo, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuthHeader,
        },
        httpsAgent: agent
    })
    .then(response => {
        res.json({ success: true, data: response.data });
    })
    .catch(error => {

        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
}); 
app.post('/aplicarCanvis', (req, res) => {
    var endpointUrl = 'https://1.0.0.2/api/v1/firewall/apply';
    var foo = {foo: 0} 
    axios.post(endpointUrl,foo, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuthHeader,
        },
        httpsAgent: agent
    })
    .then(response => {
        res.json({ success: true, data: response.data });
    })
    .catch(error => {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
}); 
app.get('/dispositiusConnectats', (req, res) => {
    var endpointUrl = 'https://1.0.0.2/api/v1/services/dhcpd/lease';
    //var foo = {foo: 0} 
    axios.get(endpointUrl, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': basicAuthHeader,
        },
        httpsAgent: agent
    })
    .then(response => {
        res.json({ success: true, data: response.data });
    })
    .catch(error => {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
}); 
app.listen(8000,()=>console.log('Ens escoltes? Estem al port 8000'));
