import Redis from 'ioredis'

import config from './config.js'

async function main() {
  let redis = new Redis(config.REDIS_URL)
  console.log(await redis.keys('*'))
  await redis.quit()
}

main()
