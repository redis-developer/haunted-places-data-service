import { gql } from 'apollo-server'

export default gql`

  type Place {
    id: ID!
    location: String
    description: String
    coordinates: Coordinates
    city: City
    state: State
  }

  type City {
    name: String
    state: State
    coordinates: Coordinates
    places: [Place]
  }

  type State {
    name: String,
    abbreviation: String
    places: [Place]
    cities: [City]
  }

  type Coordinates {
    latitude: Float
    longitude: Float
  }

  type Query {
    place(id: ID!): Place
    placesContaining(text: String!): [Place]
    placesNear(latitude: Float!, longitude: Float!, radiusInMiles: Float!): [Place]
    city(city: String!, state: String!): City
    cities: [City]
    state(state: String!): State
    states: [State]
  }
`
