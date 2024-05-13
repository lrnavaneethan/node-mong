const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/students')
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

const port = process.env.PORT || 3000;

const userSchema = new mongoose.Schema({
    rollnumber: String,
    name: String,
    email: String,
    number: Number,
    school: String,
    city: String
});

// Create a Mongoose model
const User = mongoose.model('User', userSchema);

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Serve the HTML form
app.get('/students', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/index.html/submit', (req, res) => {
    const { rollnumber, name, email, number, school, city } = req.body;

    // Create a new user instance
    const newUser = new User({
        rollnumber,
        name,
        email,
        number,
        school,
        city
    });

    // Save the new user to the database
    newUser.save()
        .then(() => {
            res.send('Student details saved successfully!');
        })
        .catch(err => {
            console.error('Error saving student details:', err);
            res.status(500).send('Error saving student details');
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
