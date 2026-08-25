import { useState } from 'react';
import './ProductReviews.css';

export default function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: 'Priya Sharma',
      rating: 5,
      date: '2024-01-15',
      comment: 'Amazing product! My skin feels so soft and glowing. Highly recommend!',
      verified: true,
      helpful: 24
    },
    {
      id: 2,
      userName: 'Rajesh Kumar',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good quality product. Takes time to show results but worth it.',
      verified: true,
      helpful: 12
    },
    {
      id: 3,
      userName: 'Anita Desai',
      rating: 5,
      date: '2024-01-05',
      comment: 'Best serum I have used! Effective ingredients and no side effects.',
      verified: true,
      helpful: 18
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(star => 
    reviews.filter(r => r.rating === star).length
  );

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    const review = {
      id: reviews.length + 1,
      ...newReview,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      helpful: 0
    };

    setReviews([review, ...reviews]);
    setNewReview({ userName: '', rating: 5, comment: '' });
    setShowReviewForm(false);
    alert('Thank you for your review! It will be published after verification.');
  };

  const renderStars = (rating, size = 'medium') => {
    return (
      <div className={`star-rating ${size}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <button 
          className="write-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          Write a Review
        </button>
      </div>

      {/* Review Summary */}
      <div className="review-summary">
        <div className="summary-rating">
          <div className="rating-number">{averageRating.toFixed(1)}</div>
          {renderStars(Math.round(averageRating), 'large')}
          <div className="total-reviews">{reviews.length} reviews</div>
        </div>

        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div key={star} className="rating-bar">
              <span className="star-label">{star} ★</span>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{width: `${(ratingCounts[index] / reviews.length) * 100}%`}}
                />
              </div>
              <span className="rating-count">{ratingCounts[index]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-container">
          <h3>Write Your Review</h3>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                required
                value={newReview.userName}
                onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Rating *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star-input ${star <= newReview.rating ? 'selected' : ''}`}
                    onClick={() => setNewReview({...newReview, rating: star})}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review *</label>
              <textarea
                required
                rows="4"
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Share your experience with this product..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Submit Review</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="reviewer-name">
                    {review.userName}
                    {review.verified && (
                      <span className="verified-badge">✓ Verified Purchase</span>
                    )}
                  </div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              {renderStars(review.rating, 'small')}
            </div>

            <div className="review-comment">
              {review.comment}
            </div>

            <div className="review-footer">
              <button className="helpful-btn">
                👍 Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
