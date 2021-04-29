export default {

  Query: {

    place: async (parent, args, context) => {
      let { id } = args
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.fetchPlace(id)
    },

    placesContaining: async (parent, args, context) => {
      let { text } = args
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.findPlacesContaining(text)
    },

    placesNear: async (parent, args, context) => {
      let { latitude, longitude, radiusInMiles } = args
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.findPlacesNear(latitude, longitude, radiusInMiles)
    },

    city: async (parent, args, context) => {
      let { city, state } = args
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.fetchCity(city, state)
    },

    cities: async (parent, args, context) => {
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.findAllCities()
    },

    state: async (parent, args, context) => {
      let { state } = args
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.fetchState(state)
    },

    states: async (parent, args, context) => {
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.findAllStates()
    }
  },

  Place: {
    city: async (parent, args, context) => {
      let { city, state } = parent
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.fetchCity(city, state)
    },

    state: async (parent, args, context) => {
      let { state } = parent
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.fetchState(state)
    },

    coordinates: parent => parseCoordinates(parent.coordinates)
  },

  City: {
    state: async (parent, args, context) => {
      let { state } = parent
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.fetchState(state)
    },

    coordinates: parent => parseCoordinates(parent.coordinates),

    places: async (parent, args, context) => {
      let { name, state } = parent
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.findPlacesForCity(name, state)
    }
  },

  State: {
    places: async (parent, args, context) => {
      let { abbreviation } = parent
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.findPlacesForState(abbreviation)
    },

    cities: async (parent, args, context) => {
      let { abbreviation } = parent
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.findCitiesForState(abbreviation)
    }
  }
}

function parseCoordinates(coordinates) {
  let isCoordinates = /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/

  if (coordinates?.match(isCoordinates)) {
    let [ longitude, latitude ] = coordinates.split(',')
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    }
  }
}
