import axios from 'axios';

async function testSearch() {
    try {
        // Assume server is running on 5000
        const query = 'idk';
        console.log(`Searching for "${query}"...`);
        const res = await axios.get(`http://localhost:5000/api/search?q=${query}`);
        console.log('Status:', res.status);
        console.log('Results:', res.data);
    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
}

testSearch();
