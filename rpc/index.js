const zerorpc = require('zerorpc')

exports.createServer = (options, impl) => {
  const { methods = getCallableNames(impl) } = options

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
    const { timesTryNextPort = 10, onError } = options
    server.on('error', onError || console.error)
    const bind = (address, triesLeft) => {
      try { server.bind(address) }
      catch (e) {
        if (triesLeft && /Address already in use/.test(e)) {
          let port; [ address, port ] = address.match(/^(.+):(\d+)$/).slice(-2)

          console.log(`${e.message}.. trying port ${port = Number(port) + 1}`)
          bind(`${address}:${port}`, triesLeft - 1)
        }
        throw e
      }
    }

    bind(options.address, timesTryNextPort)
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

const getCallableNames = obj => {
  const prototype = Object.getPrototypeOf(obj)

  return [
    ...Object
      .getOwnPropertyNames(obj)
      .filter(name => {
        if (Object[name]) return
        const { value, get } = Object.getOwnPropertyDescriptor(obj, name)
        return get || (typeof value == 'function')
      })
    ,
    ...prototype ? getCallableNames(prototype) : []
  ]
}