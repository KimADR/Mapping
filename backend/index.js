const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const userRoute = require('./routes/users');
const pinRoute = require('./routes/pins');

dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => console.log(err));

app.use('/api/users', userRoute);
app.use('/api/pins', pinRoute);

app.listen(8800, () => {
    console.log('Server is running on port 8800');
});