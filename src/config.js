const config = {
  PORT: process.env.HAUNTED_PLACES_DATA_SERVICE_PORT ?? 80,
  REDIS_URL: process.env.HAUNTED_PLACES_DATA_SERVICE_REDIS_URL ?? 'redis://localhost:6379/0'
}

export default config
