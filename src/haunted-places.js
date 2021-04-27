export default class HauntedPlacesDataSource {

  constructor(redis) {
    this.redis = redis
  }

  async fetchPlace(id) {
    return this.fetch(`place:${id}`)
  }

  async fetchCity(city, state) {
    return this.fetch(`city:${city}:${state}`)
  }

  async fetchState(state) {
    return this.fetch(`state:${state}`)
  }

  async fetch(key) {
    return this.redis.hgetall(key)
  }

}
