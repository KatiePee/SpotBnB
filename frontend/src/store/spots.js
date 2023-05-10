import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/allSpots';
const GET_SPOT = 'spots/singleSpot'

const getAllSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  payload: spots
})

const getSpot = (spot) => {
  return {
    type: GET_SPOT,
    payload: spot
  }
}

export const fetchAllSpots = () => async dispatch => {
  const res = await csrfFetch('/api/spots');
  if (res.ok) {
    const spots = await res.json()
    dispatch(getAllSpots(spots.Spots))
    return res
  } else return null
}

export const fetchSpot = (spotId) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json()
    dispatch(getSpot(spot))
    return res
  } else {
    const errors = await res.json();
    return errors;
  }
}

const initialState = { allSpots: {}, singleSpot: {} }
const spotReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL_SPOTS:
      newState = { ...state, allSpots: {}, singleSpot: {} };
      action.payload.forEach(el => newState.allSpots[el.id] = el)
      return newState;
    case GET_SPOT:
      newState = { ...state, allSpots: {}, singleSpot: {} };
      newState.singleSpot = action.payload
      return newState;
    default:
      return state;
  }
}

export default spotReducer
