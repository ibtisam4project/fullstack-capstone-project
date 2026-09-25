import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';
import {urlConfig} from '../../config';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
			// Task 1: Check for authentication and redirect
            navigate('/app/login');
        }

        // get the gift to be rendered on the details page
        const fetchGift = async () => {
            try {
				// Task 2: Fetch gift details
                const url = `${urlConfig.backendUrl}/api/gifts/${productId}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();

		// Task 3: Scroll to top on component mount
		window.scrollTo(0, 0);

    }, [productId, navigate]);


    const handleBackClick = () => {
		// Task 4: Handle back click
		navigate(-1);
	};

	//The comments have been hardcoded for this project.
    // Instead we will use gift.comments

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const authtoken = sessionStorage.getItem('auth-token');
            const author = sessionStorage.getItem('name') || "Anonymous";
            const comment = e.target.comment.value;
            
            // fetch sentiment
            const sentimentResponse = await fetch(`${urlConfig.backendUrl}/api/sentiment?sentence=${encodeURIComponent(comment)}`);
            let sentimentResult = { sentiment: "neutral" };
            if (sentimentResponse.ok) {
                sentimentResult = await sentimentResponse.json();
            }

            const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authtoken}`
                },
                body: JSON.stringify({ author, comment, sentiment: sentimentResult.sentiment })
            });
            if (response.ok) {
                const updatedComments = await response.json();
                setGift({ ...gift, comments: updatedComments });
                e.target.reset();
            }
        } catch (err) {
            console.error('Error adding comment', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!gift) return <div>Gift not found</div>;

return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card product-details-card">
                <div className="card-header text-white">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? (
			// Task 5: Display gift image
			<img src={gift.image} alt={gift.name} className="product-image-large" />
                        ) : (
                            <div className="no-image-available-large">No Image Available</div>
                        )}
                    </div>
                    {/* Task 6: Display gift details */}
                    	<p><strong>Category:</strong> 
				{gift.category}
			</p>
                    	<p><strong>Condition:</strong> 
				{gift.condition}
                    	</p>
                    	<p><strong>Date Added:</strong> 
				{new Date(gift.date_added * 1000).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    	<p><strong>Age (Years):</strong> 
				{gift.age_years}
                    	</p>
                    	<p><strong>Description:</strong> 
				{gift.description}
                    	</p>
                </div>
            </div>
            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>
                
                <form onSubmit={handleCommentSubmit} className="mb-4">
                    <div className="form-group">
                        <textarea name="comment" className="form-control" rows="3" placeholder="Add a comment..." required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Post Comment</button>
                </form>

				{/* Task 7: Render comments section by using the map function to go through all the comments */}
				{gift.comments && gift.comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                            <small className="text-muted">Sentiment: {comment.sentiment || 'neutral'}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DetailsPage;
