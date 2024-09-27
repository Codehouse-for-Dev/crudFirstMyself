const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import Mongoose

const app = express();

// Replace `fakedb` with a real MongoDB connection
const fakedb = [];
console.log(fakedb);

// Use bodyParser to parse form data into JSON format
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
const mongoURI = "mongodb://127.0.0.1:27017/registrationdb";  // Use your MongoDB connection string here
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB...", err));

// Define a Mongoose schema and model for your registration data
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const Registration = mongoose.model('Registration', registrationSchema);

// Serve your HTML form (for testing purposes)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');  // Assuming your form is in index.html
});

// Handle form submission and save data to MongoDB
app.post('/submitregistration', async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        // Simple validation
        if (password !== confirm_password) {
            return res.send('Passwords do not match!');
        }

        // Create a new registration document using Mongoose
        const newRegistration = new Registration({
            name: name,
            email: email,
            password: password,
        });

        // Save the document to MongoDB
        await newRegistration.save();

        console.log("Data saved to MongoDB:", newRegistration);

        

        // Send a success response
        res.send('Registration successful! Welcome, ' + name);

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send('An error occurred.');
    }
});


app.get("/user/:id" , async(req,res) => {
    const userid = req.params.id

    const getuser = await Registration.findById(userid)
    if (! getuser){
        return res.status(404).send("user not found")
    }
    else{
        console.log("user found")
        res.status(200).send("User found" + getuser.name)
    }
});

app.put('/updateusername/:id', async (req, res) => {
    try {
        // Get the user ID and new name from the request parameters and body
        const userId = req.params.id;
        const newUsername = req.body.name;

        // Validate the new username
        if (!newUsername || newUsername.trim() === "") {
            return res.status(400).send("Invalid username!");
        }

        // Update the user's name using findByIdAndUpdate
        const updatedUser = await Registration.findByIdAndUpdate(
            userId,
            { name: newUsername },
            { new: true, runValidators: true }
        );

        // Check if user was found and updated
        if (!updatedUser) {
            return res.status(404).send("User not found or update failed.");
        }

        // Send the updated user details as a response
        res.send(`Username updated successfully! New details: ${JSON.stringify(updatedUser)}`);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send('An error occurred while updating the username.');
    }
});


// app.delete("deleteuser/:id" , async (req,res) => {
//     const userid = req.params.id

//     const deletedUser = await Registration.findByIdAndDelete(userid)
    
//     if(! deletedUser){
//         res.status(400).send("some error while deleting")
//         console.log("User not deleted")
//     }else{
//         res.status(200).send("user succefully deleted ")
//         console.log("user deleted")
//     }

// })

app.delete("/user/:id", async (req, res) => {
    const userId = req.params.id; // Extract the user ID from the request parameters

    try {
        // Find and delete the user by ID
        const deletedUser = await Registration.findByIdAndDelete(userId);
        
        // Check if the user was found and deleted
        if (!deletedUser) {
            return res.status(404).send("User not found."); // Send 404 if user is not found
        } else {
            res.status(200).send("User successfully deleted."); // Send success response
            console.log("User deleted:", deletedUser); // Log the deleted user information
        }
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error("Error while deleting user:", error);
        res.status(500).send("An error occurred while deleting the user."); // Send 500 if there's an error
    }
});
// Start the server
app.listen(4000, () => {
    console.log("server running")
})
