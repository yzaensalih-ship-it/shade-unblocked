import express from 'express';
import http from 'http';
import { createBareServer } from '@tomphttp/bare-server-node';
import { scramjetPath } from '@mercuryworkshop/scramjet';
import { handleWisp } from 'wisp-js-server';

const app = express();
const server = http.createServer(app);
const bare = createBareServer('/bare/');

// Serves files from the current root folder where your index.html lives
app.use(express.static('.'));
app.use('/scramjet/', express.static(scramjetPath));

app.use((req, res) => {
    if (bare.shouldRoute(req)) {
        bare.route(req, res);
    } else {
        res.status(404).send('Not found');
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else if (req.url.endsWith('/wisp/')) {
        handleWisp(req, socket, head);
    } else {
        socket.destroy();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Shade proxy server running on port ${PORT}`);
});
