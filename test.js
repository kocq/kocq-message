const KocqMessage = require('.');

const message = new KocqMessage({
  sync: true
});

message.use(async function (ctx, next) {
  ctx.reply('hello world!');
  await next();
})

message.use({
  install(add) {
    add(function (ctx) {

    })
  }
})

message.callback()
