const mqtt = require('mqtt')
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

const host = 'ws://localhost:1883'

const options = {
  keepalive: 30,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
  rejectUnauthorized: false
}

console.log('connecting mqtt client')
const client = mqtt.connect(host, options)

client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})

client.on('connect', () => {
	console.log('Client connected:' + clientId)

  client.subscribe('$SYS/+/new/clients', { qos: 0 })
  client.subscribe('$SYS/+/disconnect/clients', { qos: 0 })
  
  for (let i =0;i<20;i++)
  	client.publish('testtopic', 'ws connection demo...!', { qos: 0, retain: false })
  console.log('done')
})

var totals =0
client.on('message', (topic, message, packet) => {
  if (topic.includes('new')){
    totals =totals +1
  }
  else totals = totals-1
  console.log(totals)
  // console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
})


client.on('close', () => {
  console.log(clientId + ' disconnected')
})