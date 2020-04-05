const { createServer, createClient } = require('./server')

const server = createServer(
  { address: 'tcp://127.0.0.1:4242' },
  { test() { return 'hello' } }
)

server.start()

createClient(server)
  .connect()
  .test()
  .then(console.log)