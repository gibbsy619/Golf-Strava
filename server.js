// Filename - server.js

const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const async = require('async');

// Create a queue with a concurrency of 1
const queue = async.queue((task, callback) => {
    fs.writeFile('golf_data.json', JSON.stringify(task.data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file', err);
        } else {
            console.log('Successfully wrote file');
        }
        callback();
    });
}, 1);


// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post('/api/save', (req, res) => {
    const newData = req.body;

    console.log('Received');

    // Read existing data from the file
    fs.readFile('golf_data.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file', err);
            res.status(500).send('Error reading file');
            return;
        }

        // Parse the existing data into a JavaScript object
        let existingData = data ? JSON.parse(data) : {};

        console.log(existingData);
        console.log('new data', newData);

        console.log('newData', newData['saveInformation']);
        console.log('newdddddData', newData['saveInformation'][0]);
        const holeData = newData['saveInformation'].find(item => item['currentHole'] === 3);
        console.log('newData hole', holeData);
        
        // const holeKey = 'Hole ' + newData['currentHole'];

        // if (existingData[holeKey + 1]) {
        //     // If the hole already exists, only update the counter field
        //     existingData[holeKey]['counter'] = newData['counter'];
        // } else {
        //     // If the hole doesn't exist, create it
        //     existingData[holeKey] = {
        //         counter: newData['counter'],
        //         recentPaths: newData['recentPaths'],
        //         difference: newData['difference']
        //     };
        // }

        existingData = newData['saveInformation'];

        // Add the write operation to the queue
        queue.push({ data: existingData }, (err) => {
            if (err) {
                res.status(500).json({ message: 'Error writing file' });
            } else {
                res.json({ message: 'Successfully wrote file' });
            }
        });
        });
});


app.get('/api/data', (req, res) => {
    console.log('Getting data');
    fs.readFile('golf_data.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file', err);
            res.status(500).send('Error reading file');
            return;
        }

        // Parse the data into a JavaScript object and send it as a response
        let existingData = data ? JSON.parse(data) : {};
        res.send(existingData);
    });
});

const port = process.env.PORT || 3004;
app.listen(port, () => console.log(`Server is listening on port ${port}`));