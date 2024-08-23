const express = require('express');

const app = express();
const Redis = require('ioredis');
const client = new Redis({
    host: 'redis-14067.c92.us-east-1-3.ec2.redns.redis-cloud.com',
    port: 14067,
    password: 'hEOunlZSzgWofdKGdCpybvuuZh16LSJd'
});

app.use(express.json());
const streamName = 'myStream';

app.post('/addPlayer', async (req, res) => {
    console.log("Player Info___________", req.body);
    try {
        await client.hset('players', `playerId ${req.body.playerId}`, JSON.stringify(req.body));
        res.status(200).send({
            message: 'Player added successfully',
        });
    } catch (error) {
        res.status(500).send('Error adding player');
    }
})

app.post('/processData', async (req, res) => {
    const data = req.body;
    console.log("Process Data++++++", data);
    try {
        await client.xadd(streamName, '*', `playerId ${data.playerId}`, data.score);
        res.status(200).send({
            message: 'Player added successfully'
        });
    } catch (error) {
        res.status(500).send('Error adding player');
    }
})

app.listen(4000, () => {
    console.log('Producer running on port 4000');
});