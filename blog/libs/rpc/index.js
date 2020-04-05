const zerorpc = require('zerorpc')

exports.createServer = (options, impl) => {
  const methods = Object.keys(impl)
  const server = new zerorpc.Server(
    methods.reduce(
      (handlers, method) => {
        handlers[method] = function (args, reply) {
          // zerorpc uses a hack that requires handler function to be defined
          // in es5 syntax ("async" is not supported)
          Promise
            .resolve(impl[method](...args))
            .then(
              result => reply(null, result),
              error => reply(error)
            )
        }

        return handlers
      }, { }
    )
  )

  const stop = () => server.close()
  
  const start = () => {
    server.on('error', options.onError || console.error)

    server.bind(options.address)
    return server
  }

  return { ...options, start, stop }
}

exports.createClient = options => {
  const client = new zerorpc.Client()
  const disconnect = () => client.close()
      
  const connect = () => {
    client.on('error', options.onError || console.error)
    client.connect(options.address)

    return new Proxy({}, {
      get: (_, method) => (...args) => new Promise((resolve, reject) => {
        client.invoke(method, args, (error, res, meta) => {
          if (error) reject(error)

          resolve(res)
        })
      })
    })
  }

  return { connect, disconnect }
}