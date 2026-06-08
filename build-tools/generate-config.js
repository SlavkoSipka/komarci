const fs = require('fs');
const path = require('path');

const config = `const CONFIG = {
    GOOGLE_MAPS_API_KEY: '${process.env.GOOGLE_MAPS_API_KEY || ''}',
    EMAILJS_PUBLIC_KEY: '${process.env.EMAILJS_PUBLIC_KEY || ''}',
    EMAILJS_SERVICE_ID: '${process.env.EMAILJS_SERVICE_ID || ''}',
    EMAILJS_TEMPLATE_ID: '${process.env.EMAILJS_TEMPLATE_ID || ''}'
};
`;

const outputPath = path.join(__dirname, '../js/config.js');
fs.writeFileSync(outputPath, config);
console.log('✅ config.js generated from environment variables');
