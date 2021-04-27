import { ApolloServer } from 'apollo-server'
import Redis from 'ioredis'

import config from './config.js'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import HauntedPlacesDataSource from './haunted-places.js'

async function main() {
  let redis = new Redis(config.REDIS_URL)

  let server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      hauntedPlaces: new HauntedPlacesDataSource(redis)
    })
  })

  let info = await server.listen({ port: config.PORT })
  console.log(`👻 Server ready at ${info.url} 👻`)
}

main()
