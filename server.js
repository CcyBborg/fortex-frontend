const express = require('express');
const cors = require('cors')
const path = require('path');
require('dotenv/config');

const app = express();

// Auth Passport setup
app.use(cors());


// Serve static content if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('./client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Start server
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`))
