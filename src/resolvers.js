export default {

  Query: {

    place: async (parent, args, context) => {
      let { id } = args
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.fetchPlace(id)
    },

    city: async (parent, args, context) => {
      let { city, state } = args
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.fetchCity(city, state)
    },

    state: async (parent, args, context) => {
      let { state } = args
      let { hauntedPlaces } = context.dataSources
      return await hauntedPlaces.fetchState(state)
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

    coordinates: parent => parseCoordinates(parent.coordinates)
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
