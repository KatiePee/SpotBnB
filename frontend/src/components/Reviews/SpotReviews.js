import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchSpotReviews } from "../../store/reviews";
console.log('hits spot review file')

export default function SpotReviews({ props }) {
  const { spotId, user } = props
  console.log('~~~~~~~~ hits spot review component ~~~~~~~~~~~~~~~')
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(true)

  const dispatch = useDispatch();
  const reviewsState = useSelector(state => state.reviews.spot);
  const reviews = reviewsState ? Object.values(reviewsState) : [];
  console.log('~~~~~~~~~~ review state from use selector~~~~~~~~~', reviewsState)
  useEffect(() => {
    dispatch(fetchSpotReviews(spotId))
    setIsLoading(false);

  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;


  if (!reviews.length) return null;


  const _getMonth = (date) => {
    const event = new Date(date);
    const month = event.toLocaleString('default', { month: 'long' });
    const year = event.toLocaleString('default', { year: 'numeric' });
    return `${month} ${year}`
  }
  return (
    // <h1>TES TEST TEST</h1>
    <div className='spotDetails__reviews reviews'>
      {reviews.map(review => {
        if (review.User.id === user.id) {
          // setIsAuth(true)
        }
        console.log('**********',)

        return (
          <div className='reviews__card' key={review.id}>
            <p className='reviews__name'>{review.User.firstName}</p>
            <p className='reviews__date'>{_getMonth(review.createdAt)}</p>
            <p className='reviews__review'>{review.review}</p>
            <button className={isAuth ? '' : 'hidden'}>Delete Review</button>
          </div>

        )
      })}
    </div>
  )
}