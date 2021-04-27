import csv from 'csv-parser'
import Redis from 'ioredis'

import fs from 'fs'

const PLACES_INDEX = 'places:index'
const CITIES_INDEX = 'cities:index'
const STATES_INDEX = 'states:index'

let redis = new Redis()

async function main() {
  await flushAll()
  await addIndices()
  await loadData()
  await quit()
}

async function flushAll() {
  return redis.flushall()
}

async function quit() {
  return redis.quit()
}

async function addIndices() {

  let indices = await redis.call('FT._LIST')
  
  let pipeline = redis.pipeline()
  addPlaceIndex(pipeline, indices)
  addCityIndex(pipeline, indices)
  addStateIndex(pipeline, indices)
  return pipeline.exec()
}

function addPlaceIndex(pipeline, indices) {
  if (indices.includes(PLACES_INDEX)) dropIndex(PLACES_INDEX)
  addIndex(pipeline, PLACES_INDEX, 'place:',
      'location', 'TEXT',
      'description', 'TEXT',
      'coordinates', 'GEO',
      'city', 'TAG',
      'state', 'TAG'
  )
}

function addCityIndex(pipeline, indices) {
  if (indices.includes(CITIES_INDEX)) dropIndex(CITIES_INDEX)
  addIndex(pipeline, CITIES_INDEX, 'city:',
    'name', 'TAG',
    'state', 'TAG',
    'coordinates', 'GEO'
  )
}

function addStateIndex(pipeline, indices) {
  if (indices.includes(STATES_INDEX)) dropIndex(STATES_INDEX)
  addIndex(pipeline, STATES_INDEX, 'state:',
    'name', 'TAG',
    'abbreviation', 'TAG'
  )
}

function dropIndex(pipeline, index) {
  if (indices.includes(index)) {
    pipeline.call('FT.DROPINDEX', index)
  }
}

function addIndex(pipeline, index, prefix, ...schema) {
  pipeline.call(
    'FT.CREATE', index,
    'ON', 'hash',
    'PREFIX', 1, prefix,
    'SCHEMA', ...schema
  )
}

async function loadData() {

  let pipeline = redis.pipeline()
  let id = 1

  return new Promise(resolve => {
    fs.createReadStream('data/haunted_places.csv')
      .pipe(csv())
      .on('data', data => {
        addPlace(pipeline, id++, data)
        addCity(pipeline, data)
        addState(pipeline, data)
      })
      .on('end', () => resolve(pipeline.exec()))
  })
}

async function addPlace(pipeline, id, data) {
  let { location, description, longitude, latitude, city, state_abbrev } = data

  pipeline.hset(`place:${id}`, {
    id,
    location,
    description,
    coordinates: buildCoordinateString(latitude, longitude),
    city,
    state: state_abbrev
  })
}

async function addCity(pipeline, data) {
  let { city, state_abbrev, city_longitude, city_latitude } = data

  pipeline.hset(`city:${city}:${state_abbrev}`, {
    name: city,
    state: state_abbrev, 
    coordinates: buildCoordinateString(city_latitude, city_longitude)
  })
}

async function addState(pipeline, data) {
  let { state, state_abbrev } = data

  pipeline.hset(`state:${state_abbrev}`, {
    name: state,
    abbreviation: state_abbrev
  })
}

function buildCoordinateString(latitude, longitude) {
  return (longitude && latitude) ? `${longitude},${latitude}` : ''
}


main()
