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
  }

  type State {
    name: String,
    abbreviation: String
  }

  type Coordinates {
    latitude: Float
    longitude: Float
  }

  type Query {
    place(id: ID!): Place
    city(city: String!, state: String!): City
    state(state: String!): State
  }
`
