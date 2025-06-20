🚀 Project: BTC Ordinal Collection Stats API
🎯 Goal:
Build an API that fetches and returns collection stats (e.g. floor price, volume, number of listings) for Ordinals collections using a public API like Magic Eden or OKX.

📌 Functional Requirements:
`GET /collections`

Returns a list of collections with:
* collection_name
* floor_price
* 24h_volume
* total_listings
* image_url

Should support filtering by:
* min_volume
* sort_by (e.g. floor price or volume)


`GET /collections/:slug`

Returns detailed stats for a single collection by slug or symbol.

(Optional) `GET /rankings`
Returns top 10 collections by volume or floor price.



🛠 Tech Stack:
Node.js + Express


Fetch data from Magic Eden BTC API or similar


Store in-memory (or cache in Redis or JSON for speed)



🔁 Bonus:
* Sick UI


You won’t be judged on UI. A simple table displaying this data is enough or you can design one if you like. 

📊 Example Output:
[
  {
    "collection_name": "Bitcoin Frogs",
    "floor_price": 0.01,
    "24h_volume": 3.5,
    "total_listings": 120,
    "image_url": "https://example.com/frogs.png"
  }
]


✅ Submission Requirements:
A public GitHub repo with your code


A simple README with:
* Setup instructions
* An example API request/response
* Any tradeoffs or known issues
* (Optional but appreciated) A live URL if you deployed it (e.g., via Vercel or Render)


🔍 Evaluation Criteria:
Code clarity and organization
* API functionality and completeness
* Error handling and edge case awareness
* Use of modern conventions (async/await, modular code, etc.)
* (Bonus) Thoughtfulness in design and optional improvements

🧠 What we are looking for:
* API integration skill
* Handles external data + filtering
* Provides business-relevant data
* Ability to work in a fast pace environment and be scrappy if needed