const amqp = require('amqplib/callback_api');

const q = 'test_q';

let channel;

amqp.connect(process.env.AMQP, (err, conn) => {
  if (err) throw new Error(err);

  conn.createChannel((err, ch) => {
    if (err) throw new Error(err);

    ch.assertQueue(q, { durable: true });

    channel=ch;

   
  });
});

const consumeQueue=(socketInstance)=>{


    if (!channel) setTimeout(consumeQueue(msg), 1000);


    channel.consume(
        q,
        msg => {
          let trade;
  
          try {
            trade = JSON.parse(msg.content.toString());
          } catch (e) {
            console.log(e);
  
            trade = msg.content.toString();
          }
  
          console.log('I RECEIVED A MAIL!!!', trade);
  
         socketInstance.emit("notifyTrade");
  
          channel.ack(msg);
        },
        { noAck: false }
      );
}
module.exports={
    consumeQueue
}