import { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateSpotThunk } from "../../store/spots";

export default function SpotForm({ spot, formType }) {

  const history = useHistory();

  const [country, setCountry] = useState(spot?.country)
  const [address, setAddress] = useState(spot?.address)
  const [city, setCity] = useState(spot?.city)
  const [state, setState] = useState(spot?.state)
  const [lat, setLat] = useState(spot?.lat)
  const [lng, setLng] = useState(spot?.lng)
  const [description, setDescription] = useState(spot?.description)
  const [name, setName] = useState(spot?.name)
  const [price, setPrice] = useState(spot?.price)
  const [errors, setErrors] = useState({});
  const [hasErrors, setHasErrors] = useState(false)

  const dispatch = useDispatch();


  let newErrors = {}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addSpot = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    }

    const newSpot = await dispatch(updateSpotThunk(addSpot, spot.id))

    if (newSpot.errors) {
      setErrors(newSpot.errors)
    } else {
      console.log('################### inside else conditional ########################')
      history.push(`/spots/${newSpot.id}`)
    }

  }

  return (
    <form className='creat-spot'>
      <h1>create spot form!</h1>

      <div className='create-spot__header'>
        <h3>Where's your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation.</p>

        <label>
          Country<span className='required-star'>*</span>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder='Country'
          />
          <p className='errors spot-form__errors'>{errors.country}</p>
        </label>
        <label>
          Street Address<span className='required-star'>*</span>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder='Address'
          />
          <p className='errors spot-form__errors'>{errors.address}</p>
        </label>
        <label>
          City<span className='required-star'>*</span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder='City'
          /><p className='errors spot-form__errors'>{errors.city}</p>
        </label>
        <label>
          State<span className='required-star'>*</span>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder='State'
          /><p className='errors spot-form__errors'>{errors.state}</p>
        </label>
        <label>
          Latitude<span className='required-star'>*</span>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder='Latitude'
          /><p className='errors spot-form__errors'>{errors.lat}</p>
        </label>
        <label>
          Longitude<span className='required-star'>*</span>
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder='Longitude'
          />
          <p className='errors spot-form__errors'>{errors.lng}</p>
        </label>
      </div>

      <div className='create-spot__header'>
        <h3>Describe your place to guests</h3>
        <p>Mention the best feature of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please write at least 30 characters"
        />
        <p className='errors spot-form__errors'>{errors.description}</p>
      </div>

      <div className='create-spot__header'>
        <h3>Create a title for your spot</h3>
        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name your spot'
        />
        <p className='errors spot-form__errors'>{errors.name}</p>
      </div>

      <div className='create-spot__header'>
        <h3>Set a base price for your spot</h3>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <span>$</span>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder='Price per night (USD)'
        />
        <p className='errors spot-form__errors'>{errors.price}</p>
      </div>

      <button type="submit" onClick={handleSubmit} disabled={hasErrors}>{formType}</button>

    </form>


  )
}