const PLACES_INDEX = 'places:index'
const CITIES_INDEX = 'cities:index'
const STATES_INDEX = 'states:index'

const LIMIT = 20000

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

  async findPlacesContaining(text) {
    return this.find(PLACES_INDEX, text)
  }

  async findPlacesNear(latitude, longitude, radiusInMiles) {
    return this.find(PLACES_INDEX, `@coordinates:[${longitude} ${latitude} ${radiusInMiles} mi]`)
  }

  async findPlacesForCity(city, state) {
    return this.find(PLACES_INDEX, `@city:{${city}} @state:{${state}}`)
  }

  async findPlacesForState(state) {
    return this.find(PLACES_INDEX, `@state:{${state}}`)
  }

  async findCitiesForState(state) {
    return this.find(CITIES_INDEX, `@state:{${state}}`)
  }

  async findAllCities() {
    return this.find(CITIES_INDEX, '*')
  }

  async findAllStates() {
    return this.find(STATES_INDEX, '*')
  }

  async fetch(key) {
    return this.redis.hgetall(key)
  }

  async find(index, query) {
    let [count, ...foundKeysAndValues] = await this.redis.call(
      'FT.SEARCH', index, query,
      'LIMIT', 0, LIMIT)

    return foundKeysAndValues
      .filter((_entry, index) => index % 2 !== 0)
      .map(this.arrayToObject)
  }

  arrayToObject(array) {
    let keys = array.filter((_entry, index) => index % 2 === 0)
    let values = array.filter((_entry, index) => index % 2 !== 0)
    
    return keys.reduce((object, key, index) => {
      object[key] = values[index]
      return object
    }, {})
  }
}
