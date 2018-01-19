var amqp = require('amqplib/callback_api');

// const host = "queue";
const host = "176.34.148.213:5672";
console.log("Connecting to rmq...");
amqp.connect(`amqp://${host}`, function(err, conn) {
  if (err) {
    console.log("amqp", err);
    return;
  }
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer('Hello World!'));
    console.log(" [x] Sent 'Hello World!'");
    ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log("Rec msg", msg.content.toString());
        ch.ack(msg);
      }
    });
  });
});


// var AMQPClient = require('amqp10').Client;
// const host = "b-2729deb3-7d83-4ab5-94c5-2f3e77616dd7-1.mq.eu-west-1.amazonaws.com";
// const port = "5671";

// var container = require('rhea');
// container.sasl_server_mechanisms.enable_anonymous();

// container.on('connection_open', function (context) {
//     context.connection.open_receiver('examples');
//     context.connection.open_sender('examples');
// });
// container.on('message', function (context) {
//     console.log(context.message.body);
//     context.connection.close();
// });
// container.once('sendable', function (context) {
//     context.sender.send({body:'Hello World!'});
// });
// container.connect({
//   port: 5672,
//   host: host,
// });

// var client = new AMQPClient();
// client.connect(`amqp://b-2729deb3-7d83-4ab5-94c5-2f3e77616dd7-1.mq.eu-west-1.amazonaws.com:5672`)
//   .then(function() {
//     console.log("Connected for real")
//     return Promise.all([
//       client.createReceiver('amq.topic'),
//       client.createSender('amq.topic')
//     ]);
//   })
//   .spread(function(receiver, sender) {
//     console.log("spread")
//     receiver.on('errorReceived', function(err) {
//       console.log("err rec", err);
//     });
//     receiver.on('message', function(message) {
//       console.log('Rx message: ', message.body);
//     });

//     return sender.send({ key: "Value" });
//   })
//   .error(function(err) {
//     console.log("error: ", err);
//   })
//   .catch(function(err) {
//     console.log("catch", err )
//   });
// console.log("Connecting...")

// var stompit = require('stompit');

// var connectOptions = {
//   // 'host': 'queue',
//   host: "b-2729deb3-7d83-4ab5-94c5-2f3e77616dd7-1.mq.eu-west-1.amazonaws.com",
//   port: 61614,
//   'connectHeaders':{
//     'host': '/',
//     user: "etimo-admin",
//     pass: "etimo-admin123",
//     'heart-beat': '5000,5000'
//   },
//   tls: {}
// };
// // stomp+ssl://b-2729deb3-7d83-4ab5-94c5-2f3e77616dd7-1.mq.eu-west-1.amazonaws.com:61614
// stompit.connect(connectOptions, function(error, client) {
//   if (error) {
//     console.log('connect error ' + error);
//     return;
//   }
//   var sendHeaders = {
//     'destination': '/queue/test',
//     'content-type': 'text/plain'
//   };

//   var frame = client.send(sendHeaders);
//   frame.write('hello');
//   frame.end();

//   var subscribeHeaders = {
//     'destination': '/queue/test',
//     'ack': 'client-individual'
//   };

//   client.subscribe(subscribeHeaders, function(error, message) {
//     if (error) {
//       console.log('subscribe error ' + error.message);
//       return;
//     }
//     message.readString('utf-8', function(error, body) {
//       if (error) {
//         console.log('read message error ' + error.message);
//         return;
//       }
//       console.log('received message: ' + body);
//       client.ack(message);
//       // client.disconnect();
//     });
//   });
// });
