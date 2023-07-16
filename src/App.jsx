import { useState, useEffect } from 'react';
import './App.css';
import { Amplify, PubSub, Hub } from 'aws-amplify';
import { AWSIoTProvider, CONNECTION_STATE_CHANGE } from '@aws-amplify/pubsub';
import config from './aws-exports';
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(config);

const REGION = process.env.IOT_REGION_ENV;
const ENDPOINT = process.env.IOT_ENDPOINT_ENV;

// Apply plugin with configuration
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: REGION,
    aws_pubsub_endpoint: ENDPOINT
  })
);

function App({ signOut }) {

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

    console.log(REGION, ENDPOINT)

    PubSub.subscribe('dataTopic').subscribe({
      next: data => console.log('Message received', data),
      error: error => console.error(error),
      complete: () => console.log('Done')
    });

    Hub.listen('dataTopic', (data) => {
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        const connectionState = payload.data.connectionState;
        console.log(connectionState);
      }
    });
  }, [])


  return (
    <>
      <h3>Amplify x IoT Core</h3>
      <button onClick ={publishToTopic}>Run Simulator</button>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
}

export default withAuthenticator(App);
