const mqtt = require('mqtt')

const host = 'ws://d5d4-58-186-53-239.ngrok.io'

const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

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
    client.subscribe('testtopic', { qos: 0 })
    client.subscribe('$SYS/+/new/clients')

    client.publish('testtopic', 'ws connection demo...!', { qos: 0, retain: false })
})

client.on('message', (topic, message, packet) => {
    console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
})

client.on('close', () => {
    console.log(clientId + ' disconnected')
})