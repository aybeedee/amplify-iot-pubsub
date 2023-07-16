const awsIot = require('aws-iot-device-sdk');
const { setTimeout } = require('timers/promises');
const thingSecrets = require('./thing-secrets/secrets.js');

let simulationRunning = false;

let device = awsIot.device({
    keyPath: thingSecrets.keyPath,
    certPath: thingSecrets.certPath,
    caPath: thingSecrets.caPath,
    clientId: thingSecrets.clientId,
    host: thingSecrets.host
});

async function simulateData() {

    for (let i = 0; i < 20; i++)  {

        temp = (Math.random()*(10) + 20).toFixed(2);
        humid = (Math.random()*(10) + 45).toFixed(2);
        moist = (Math.random()*(10) + 58).toFixed(2);

        device.publish('dataTopic', JSON.stringify({ 
            temperature: temp,
            humidity: humid,
            moisture: moist
        }));
        await setTimeout(500);
    }

    simulationRunning = false;
}

device.on('connect', function() {
    console.log('device connected!');
    device.subscribe('executeTopic');
});

device.on('message', function(topic, payload) {

    message = JSON.parse(payload.toString());
    console.log(message.command);

    if ((message.command === 'run') && (simulationRunning === false)) {

        simulationRunning = true;
        simulateData();
    }
});