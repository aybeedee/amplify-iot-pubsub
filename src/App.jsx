import { useState, useEffect } from 'react';
import './App.css';
import { Amplify, PubSub, Hub, Auth } from 'aws-amplify';
import { AWSIoTProvider, CONNECTION_STATE_CHANGE } from '@aws-amplify/pubsub';
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

  const [userCognitoId, setUserCognitoId] = useState("");

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
      next: data => console.log('Message received', data),
      error: error => console.error(error),
      complete: () => console.log('Done')
    });

  // getting the signed in user's cognito id to provide them access to iot core
  Auth.currentCredentials().then((info) => {
    const cognitoIdentityId = info.identityId;
    setUserCognitoId(cognitoIdentityId);
  });
  
    // Hub.listen('dataTopic', (data) => {
    //   const { payload } = data;
    //   if (payload.event === CONNECTION_STATE_CHANGE) {
    //     const connectionState = payload.data.connectionState;
    //     console.log(connectionState);
    //   }
    // });
  }, [])


  return (
    <>
      <h3>Amplify x IoT Core</h3>
      <p>{userCognitoId}</p>
      <p>r {process.env.REACT_APP_ENDPOINT} r</p>
      <p>r {process.env.REACT_APP_REGION} r</p>
      <button onClick ={publishToTopic}>Run Simulator</button>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
}

export default withAuthenticator(App);
