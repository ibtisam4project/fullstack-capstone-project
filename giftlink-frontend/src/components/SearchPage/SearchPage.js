import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';

function SearchPage() {
    //Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);

    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        try {
            let url = `${urlConfig.backendUrl}/api/search?name=${searchQuery}&age_years=${ageRange}&category=${category}&condition=${condition}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.log('Fetch error: ' + error.message);
        }
    };

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        // Task 6. Enable navigation to the details page of a selected gift.
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Task 3: Dynamically generate category and condition dropdown options.*/}
                            <label htmlFor="categorySelect">Category</label>
                            <select id="categorySelect" className="form-control my-1" onChange={(e) => setCategory(e.target.value)}>
                                <option value="">All</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>

                            <label htmlFor="conditionSelect">Condition</label>
                            <select id="conditionSelect" className="form-control my-1" onChange={(e) => setCondition(e.target.value)}>
                                <option value="">All</option>
                                {conditions.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>

                            {/* Task 4: Implement an age range slider and display the selected value. */}
                            <label htmlFor="ageRange">Less than {ageRange} years</label>
                            <input
                                type="range"
                                className="form-control-range"
                                id="ageRange"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Task 7: Add text input field for search criteria*/}
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search for gifts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Task 8: Implement search button with onClick event to trigger search:*/}
                    <button className="btn btn-primary w-100 mb-3" onClick={handleSearch}>
                        Search
                    </button>

                    {/*Task 5: Display search results and handle empty results with a message. */}
                    <div className="search-results">
                        {searchResults.length > 0 ? (
                            searchResults.map((gift) => (
                                <div key={gift.id} className="card mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title">{gift.name}</h5>
                                        <p className="card-text">{gift.description}</p>
                                        <button className="btn btn-info" onClick={() => goToDetailsPage(gift.id)}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info">No products found. Please revise your filters.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
