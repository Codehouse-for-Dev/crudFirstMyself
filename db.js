const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registrationDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Create a Model
const User = mongoose.model('User', userSchema);

app.post('/submit_registration', (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.send('Passwords do not match!');
    }

    // Save to the database
    const newUser = new User({ name, email, password });
    newUser.save((err) => {
        if (err) {
            return res.send('Error saving user!');
        }
        res.send('Registration successful! Welcome, ' + name);
    });
});
