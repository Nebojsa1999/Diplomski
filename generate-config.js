const fs = require('fs');

const config = {
    apiUrl: process.env.API_URL || 'http://localhost:8081'
};

fs.writeFileSync('./src/config/config.json', JSON.stringify(config, null, 2));
console.log('Config generated:', config);
