import algoliasearch from 'algoliasearch/lite';
import consola from 'consola';

import { ALGOLIA_ID, ALGOLIA_SEARCH_API_KEY } from '../env';

const searchController = {
    search: async (req, res) => {
        const { requests } = req.body;

        const client = algoliasearch(ALGOLIA_ID, ALGOLIA_SEARCH_API_KEY);

        try {
            const results = await client.search(requests);
            res.status(200).send(results);
        } catch {
            consola.error('Algolia Error. Kindly check Algolia API keys!');
        }
    }
};

export default searchController;
