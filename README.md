# AWS Amplify + IoT Core
Boilerplate for AWS Amplify-IoT Core integration

How it works:
- The React client is configured through the IoT Core endpoint
- It subscribes to the ‘dataTopic’ MQTT topic through the PubSub
- To trigger the simulation, it publishes to the ‘executeTopic’ MQTT topic (again through the PubSub)
- The IoT Device is subscribed to the ‘executeTopic’ through an MQTT Client (provided by the aws-iot-device SDK)
- Upon receiving a “run” command, it begins simulating the logging of data (similar to a sensor) by publishing through the MQTT Client

Steps:
- Initialize a react application using vite
- Make new git repo for it
- Host frontend on amplify through git repo
- Install amplify cli
- Configure amplify
- Initialize amplify backend - amplify studio
- Pull and setup the backend to local environment through cli
- Install aws-amplify libraries
- Add auth
- Add pubsub configuration and functionality
- Add aws iot device sdk config and create simulation
- Host simulation somewhere (mine is on EC2)
- Integrate with amplify through mqtt topics - can test through mqtt test client