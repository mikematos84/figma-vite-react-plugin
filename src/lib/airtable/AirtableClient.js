import Airtable from 'airtable';

/**
 * Client for interacting with the Airtable API
 */
class AirtableClient {
  /**
   * Create a new AirtableClient instance
   * @param {string} token - Airtable API token
   * @param {string} baseId - Airtable base ID
   */
  constructor(token, baseId) {
    if (!token) {
      throw new Error('Airtable token is required');
    }
    if (!baseId) {
      throw new Error('Airtable base ID is required');
    }

    // Configure Airtable with API key
    Airtable.configure({
      apiKey: token,
      endpointUrl: 'https://api.airtable.com',
    });

    this.base = Airtable.base(baseId);
  }

  async get(options) {
    const result = [];
    const table = this.base('Design Tokens');
    const query = table.select({ view: 'Grid view' });
    await query
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          if (Object.keys(record.fields).length) result.push(record.fields);
        });
        fetchNextPage();
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
    if (options && options.sorted) return result.sort((a, b) => b.key.length - a.key.length);

    console.info(result);
    return result;
  }
}

export default AirtableClient;
