import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteReviewThunk, fetchSpotReviews } from "../../store/reviews";
import { useHistory } from "react-router-dom";
import DeleteReviewModal from './DeleteReviewModal'
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../Reviews/CreatReviewModal";


export default function SpotReviews({ props }) {
  const { spotId, user, avgStarRating, numReviews, spot } = props

  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();
  const reviewsState = useSelector(state => state.reviews.spot);

  const reviews = reviewsState ? Object.values(reviewsState).reverse() : [];

  useEffect(() => {
    dispatch(fetchSpotReviews(spotId))
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  // if (!reviews.length) return null;

  const _getMonth = (date) => {
    const event = new Date(date);
    const month = event.toLocaleString('default', { month: 'long' });
    const year = event.toLocaleString('default', { year: 'numeric' });
    return `${month} ${year}`
  }

  const handleDelete = (e, reviewId) => {

    e.preventDefault();
    dispatch(deleteReviewThunk(reviewId));
    history.push(`/spots/${spotId}`)
  }

  console.log('________________ SpotDetail--spot owner ______________', spot.Owner)
  console.log('________________ SpotDetail--user ______________', user)

  const isSpotOwner = user && user.id === spot.Owner.id
  console.log('_______is spot owner? _________ -> ', isSpotOwner)
  console.log('review: ', reviews[0])

  const hasLeftReview = user && reviews.find(review => review.User.id === user.id)
  console.log('_____________has left a review?_____', hasLeftReview)



  return (
    <div className='spotDetails__reviews reviews'>

      <div className='spotDetails__reviews reviews-details'>
        <span>
          <i className="fa-sharp fa-solid fa-star"></i>
          <span className={avgStarRating ? '' : 'new-rating'}>
            {avgStarRating ? avgStarRating : 'New!'}
          </span>
        </span>
        <span className={numReviews ? '' : 'hidden'}>.</span>
        <span className={numReviews ? '' : 'hidden'}>{numReviews === 1 ? 'review' : 'reviews'}</span>
      </div>

      {user && !(hasLeftReview || isSpotOwner) && (
        <OpenModalButton
          buttonText="Create Review Modal"
          modalComponent={<CreateReviewModal props={{ spot, user }} />}
        />
      )}

      {reviews.length && !isSpotOwner ? reviews.map(review => {
        return (
          <div className='reviews__card' key={review.id}>
            <p className='reviews__name'>{review.User.firstName}</p>
            <p className='reviews__date'>{_getMonth(review.createdAt)}</p>
            <p className='reviews__review'>{review.review}</p>
            {user && review.User.id === user.id && (
              <OpenModalButton
                buttonText="Delete Review"
                modalComponent={<DeleteReviewModal props={{ reviewId: review.id, spotId, user }} />}
              />

            )}
          </div>
        )
      }) : (<p>Be the first to post a review!</p>)}
    </div>
  )
}