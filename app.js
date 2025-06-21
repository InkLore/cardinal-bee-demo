const express = require('express');
const axios = require('axios');


const app = express ();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});


/*
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

example symbol stats as returned by :
{
    symbol: 'xillions',
    floorPrice: 10000000,
    listedCount: 68,
    volumeAll: 90000000
}
*/
app.get('/collections', async (req, res) => {
    try {
        // TODO refactor unnecessary catch all block
        const limit_param = req.query.limit;
        const min_volume_param = req.query.min_volume;
        const sort_by_param = req.query.sort_by;
        
        // limiting provided to help reduce hitting the rate limit
        let limit;
        if (limit_param == null) {
            limit = -1;
        }
        else if (limit_param !== null && isNaN(limit_param)) {
            return res.status(400).json({ error: 'limit must be a valid number or omitted.' });
        }
        else {
            limit = parseInt(limit_param);
        }
        
        // determine volume filtering
        let min_volume;
        if (min_volume_param == null) {
            min_volume = 0;
        }
        else if (min_volume_param !== null && isNaN(min_volume_param)) {
            return res.status(400).json({ error: 'min_volume must be a valid number or omitted.' });
        }
        else {
            min_volume = parseInt(min_volume_param);
        }
        
        // determine sorting rule
        let sort_by;
        if (sort_by_param == null) {
            sort_by = "none";
        }
        else if (sort_by_param === "floor_price" || sort_by_param === "volume") {
            sort_by = sort_by_param;
        }
        else {
            return res.status(400).json({ error: 'sort_by must be either "floor_price" or "volume" or omitted.' });
        }
        
        const req_col_options = {
            method: 'GET',
            url: 'https://api-mainnet.magiceden.dev/v2/collections',
            headers: {accept: 'application/json'}
        };
        
        const req_col_response = await axios.request(req_col_options);
        const collections = req_col_response.data;
        
        
        // console.log(collections);
        let symbol_counter = 0;
        let symbols = [];
        for (const collection of collections) {
            // TODO parallelize these requests for efficiency
            // TODO make API wait if 429 encountered
            let symb_options = {
                method: 'GET',
                url: `https://api-mainnet.magiceden.dev/v2/collections/${collection.symbol}/stats`,
                headers: {accept: 'application/json'}
            }
            
            const symbol_stats_response = await axios.request(symb_options);
            const symbol_stats = symbol_stats_response.data;
            
            // current rule is to allow symbols with no volume
            if (
                (symbol_stats.volumeAll !== null) &&
                (!isNaN(min_volume)) &&
                (parseInt(symbol_stats.volumeAll) < min_volume)
            ) {
                continue;
            }
            
            symbols.push(symbol_stats);
            
            // console.log(symbol_stats);
            
            symbol_counter += 1;
            if (limit !== -1 && symbol_counter > limit) {
                break;
            }
        }
        
        if (sort_by === "floor_price") {
            symbols.sort((a, b) => {
                if (a.floorPrice == null && b.floorPrice == null) {
                    return 0;
                }
                else if (a.floorPrice !== null && b.floorPrice == null) {
                    return 1;
                }
                else if (a.floorPrice == null && b.floorPrice !== null) {
                    return -1;
                }
                else {
                    return parseInt(a.floorPrice) - parseInt(b.floorPrice);
                }
            })
        }
        else if (sort_by === "volume") {
            symbols.sort((a, b) => {
                if (a.volumeAll == null && b.volumeAll == null) {
                    return 0;
                }
                else if (a.volumeAll !== null && b.volumeAll == null) {
                    return 1;
                }
                else if (a.volumeAll == null && b.volumeAll !== null) {
                    return -1;
                }
                else {
                    return parseInt(a.volumeAll) - parseInt(b.volumeAll);
                }
            })
        }
        
        console.log("Symbols extracted successfully.")
        
        res.json(symbols);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});


/*
`GET /collections/:slug`

Returns detailed stats for a single collection by slug or symbol.

TODO use Magic Eden's 
- https://api-mainnet.magiceden.dev/v2/collections/{symbol}/stats
- https://api-mainnet.magiceden.dev/v2/collections/{symbol}/holder_stats
- https://api-mainnet.magiceden.dev/v2/collections/{symbol}/leaderboard
*/ 
app.get('/collections/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        
        if (
            (slug == null) ||
            !((typeof slug == 'string') || (slug instanceof String))
        ) {
            return res.status(400).json({ error: 'slug must be a valid str.' });
        }
        
        const stats_options = {
            method: 'GET',
            url: `https://api-mainnet.magiceden.dev/v2/collections/${slug}/stats`,
            headers: {accept: 'application/json'}
        };
        const holder_stats_options = {
            method: 'GET',
            url: `https://api-mainnet.magiceden.dev/v2/collections/${slug}/holder_stats`,
            headers: {accept: 'application/json'}
        };
        const leaderboard_options = {
            method: 'GET',
            url: `https://api-mainnet.magiceden.dev/v2/collections/${slug}/leaderboard`,
            headers: {accept: 'application/json'}
        };
        
        
        const [stats, holder_stats, leaderboard] = await Promise.all([
            axios.request(stats_options),
            axios.request(holder_stats_options),
            axios.request(leaderboard_options)
        ])
        
        // TODO find a better way to merge relevant data together
        let data = { 
            ...stats.data,
            ...holder_stats.data, 
            ...leaderboard.data
        };
        
        res.json(data); 
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

/*
(Optional) `GET /rankings`
Returns top 10 collections by volume or floor price.

TODO this will basically be a variant of the default collections just with stricter filtering
*/