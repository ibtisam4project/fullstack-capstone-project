# GiftLink User Stories

## Template

**As a** [type of user],  
**I want** [goal],  
**So that** [benefit].  

### Details and Assumptions
* [document what you know]

### Acceptance Criteria
```gherkin
Given [some context]
When [certain action is taken]
Then [the outcome of action is observed]
```

---

## User Stories

### Story 1: User Registration
**As a** new visitor to GiftLink,  
**I want** to create a user account with my name, email, and password,  
**So that** I can access the platform to list items and participate in gift sharing.

#### Details and Assumptions
* User must provide first name, last name, valid email address, and a secure password.
* Email address must be unique in the system.

#### Acceptance Criteria
```gherkin
Given I am on the GiftLink registration page
When I enter my valid registration details and click "Register"
Then my account is created, a JWT authentication token is issued, and I am redirected to the home page
```

---

### Story 2: User Login
**As a** registered user,  
**I want** to log in using my email and password,  
**So that** I can access my account features securely.

#### Details and Assumptions
* Credentials are authenticated against hashed passwords in MongoDB.
* A valid JWT token is stored in session storage upon successful login.

#### Acceptance Criteria
```gherkin
Given I am on the login page
When I enter my registered email and correct password and submit
Then I am logged in successfully, my user state is updated in the application context, and I can view protected resources
```

---

### Story 3: Listing Available Gifts
**As a** community member browsing GiftLink,  
**I want** to view a catalog of all available gifts posted by other users,  
**So that** I can find items I might need.

#### Details and Assumptions
* Gifts are retrieved from MongoDB via the `GET /api/gifts` endpoint.
* Each card displays the gift title, image, category, condition, and date added.

#### Acceptance Criteria
```gherkin
Given I am on the GiftLink home page
When the page loads
Then I see a list of gift cards fetched from the backend API showing item details
```

---

### Story 4: Viewing Gift Details
**As a** user interested in a gift,  
**I want** to view detailed information about a specific item,  
**So that** I can learn more about its condition, age, location, and comments.

#### Details and Assumptions
* Clicking on a gift card navigates to `/app/product/:id`.
* Item details are fetched from `GET /api/gifts/:id`.

#### Acceptance Criteria
```gherkin
Given I am viewing the list of gifts
When I click on a specific gift card
Then I am navigated to the gift detail page showing full description, zipcode, age, and existing comments
```

---

### Story 5: Searching Gifts by Category
**As a** user looking for specific items,  
**I want** to filter gifts by category and condition,  
**So that** I can quickly find relevant gifts.

#### Details and Assumptions
* Filtering is performed via `GET /api/search?category=...` query parameters.
* Filters support category dropdown, condition dropdown, and age sliders.

#### Acceptance Criteria
```gherkin
Given I am on the search page
When I select a category such as "Kitchen" and click search
Then only gifts matching the "Kitchen" category are displayed in the search results
```

---

### Story 6: Giving Away an Item
**As a** donor,  
**I want** to add a new gift item with an image, category, condition, and description,  
**So that** others in the community can request it.

#### Details and Assumptions
* Adding gifts requires authentication.
* Gift data is stored in the `gifts` MongoDB collection.

#### Acceptance Criteria
```gherkin
Given I am logged in as a registered user
When I submit the gift creation form with title, category, condition, and description
Then the new gift is saved in the database and displayed in the main catalog
```

---

### Story 7: Commenting and Sentiment Analysis
**As a** community member,  
**I want** to post comments on a gift item and receive automated sentiment analysis,  
**So that** constructive, positive interactions are promoted on the platform.

#### Details and Assumptions
* Comments are appended to the gift item document via `POST /api/gifts/:id/comment`.
* Sentiment analysis service uses the `natural` library to evaluate sentiment score.

#### Acceptance Criteria
```gherkin
Given I am on a gift details page
When I submit a comment for the item
Then the comment is saved with its analyzed sentiment (positive, neutral, or negative) and displayed under the item
```

---

### Story 8: Editing Profile Information
**As a** registered user,  
**I want** to update my profile information such as my displayed name,  
**So that** my profile stays up to date.

#### Details and Assumptions
* Profile updates are sent via `PUT /api/auth/update`.
* Requires authorization token header `Authorization: Bearer <authtoken>`.

#### Acceptance Criteria
```gherkin
Given I am logged in and on my profile page
When I edit my display name and click "Save"
Then my name is updated in the database and reflected across the site header and session storage
```

---

### Story 9: Authentication & JWT Security
**As a** platform administrator,  
**I want** user passwords to be salted/hashed and sensitive endpoints to verify JWT tokens,  
**So that** user accounts and platform data remain secure.

#### Details and Assumptions
* Passwords are hashed with `bcryptjs`.
* Session tokens use signed JSON Web Tokens (`jwt`).

#### Acceptance Criteria
```gherkin
Given a user registers or logs in
When credentials are validated
Then plain text passwords are never stored in the database, and API requests transmit JWT tokens in headers
```
