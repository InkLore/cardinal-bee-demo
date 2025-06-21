# cardinal-bee-demo
Ordinal Hive Technical Interview - Ordinal Stats API

Note: the APIs offered by OKX is not legally licensed in my state, and the API offered by Magic Eden for Ordinals is severely rate limited to the point of unusability, so for the sake of demonstrating my technical abilities I have substituted the substantially less limited default Magic Eden collections API rather than their Ordinals API.

## Setup Instructions
Installations of Node, NPM, Express, and Axios required.

## Examples
The current app is hosted using Render on https://cardinal-bee-demo.onrender.com/. Recommended examples include:
- Fast: https://cardinal-bee-demo.onrender.com/collections/xillions
- Slower: https://cardinal-bee-demo.onrender.com/collections?limit=100&sort_by=volume
- It is recommended that the collections API be tested with the optional limit included to avoid timing out the underlying Magic Eden API.

## Known Issues/Tradeoffs
Several quick TODOs include
- Caching (Redis/JSON being the recommended options)
- Parallelization of API calls in `collections/` route
- Error handling isn't as robust as it ought to be
- Optional 3rd route for rankings not yet implemented