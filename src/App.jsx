import { useState, useEffect } from 'react';
import amplifyLogo from './assets/amplify-logo.png';
import iotLogo from './assets/iot-core-logo.png';
import './App.css';
import { Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import config from './aws-exports';
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(config);

// Apply plugin with configuration
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: "us-east-1",
    aws_pubsub_endpoint: "wss://a1pn6zhotk7gpz-ats.iot.us-east-1.amazonaws.com/mqtt"
  })
);

function App({ signOut }) {

  const [sensorData, setSensorData] = useState({
    temperature: 25.7,
    humidity: 50.6,
    moisture: 64.4
  });

  async function publishToTopic() {
    try {
      await PubSub.publish("executeTopic", {
        command: "run"
      });
      console.log("sent run command!");
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {

    PubSub.subscribe('dataTopic').subscribe({
      next: data => {
        console.log(data.value)
        setSensorData({
          temperature: data.value.temperature,
          humidity: data.value.humidity,
          moisture: data.value.moisture
        })
      },
      error: error => console.error(error),
      complete: () => console.log("Done")
    });

  }, [])

  return (
    <>
      <img src={amplifyLogo} className="logo react" alt="Amplify Logo" />
      <img src={iotLogo} className="logo vite" alt="IoT Core Logo" />
      <h2>Amplify - IoT Core</h2>
      <div>
        <h3>Temperature: {sensorData.temperature} °C</h3>
        <h3>Humidity: {sensorData.humidity} %</h3>
        <h3>Moisture: {sensorData.moisture} %</h3>
      </div>
      <div className = "button-group">
        <button onClick ={publishToTopic}>Run Simulator</button>
        <button onClick= {signOut}>Sign Out</button>
      </div>
    </>
  );
}

export default withAuthenticator(App);
