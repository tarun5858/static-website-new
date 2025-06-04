const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
const mongoURI = "mongodb+srv://prehome_website_user:1ywa7PfsUW3pPWvt@lead-tracking.jysawuj.mongodb.net/website_forms";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Lead form schema & model
const leadSchema = new mongoose.Schema({
    name: String,
    contact: String,
    location: String,
    message: String
});
const Lead = mongoose.model('Lead', leadSchema);

// Appointment form schema & model
const appointmentSchema = new mongoose.Schema({
    name: String,
    contact: String,
    date: String,
    time: String
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Waitlist form schema & model
const WaitlistFormSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits'],
  },
  selectedLocation: {
    type: String,
    required: true,
    enum: [
      'Golf Course Road',
      'Golf Course Extension Road',
      'Southern Peripheral Road',
      'Dwarka Expressway',
      'Sohna Road',
      'Other',
    ],
  },
  otherLocation: { type: String, trim: true, default: '' },
  selectedLayout: {
    type: String,
    required: true,
    enum: ['2 BHK', '3 BHK', 'Other'],
  },
  otherLayout: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now },
},{ collection: 'waitlist_leads' });


const Waitlist = mongoose.model('Waitlist', WaitlistFormSchema);

// Route: Lead form
app.post('/submit-form', async (req, res) => {
    const { name, contact, location, message } = req.body;

    try {
        const newLead = new Lead({ name, contact, location, message });
        await newLead.save();
        console.log("Lead form submitted:", newLead);
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error("Error saving lead:", error);
        res.status(500).json({ error: 'Error saving form data' });
    }
});

// Route: Appointment form
app.post('/submit-appointment', async (req, res) => {
    const { name, contact, date, time } = req.body;
  console.log('Received appointment:', req.body);
    try {
        const newAppointment = new Appointment({ name, contact, date, time });
        await newAppointment.save();
        console.log("Appointment submitted:", newAppointment);
        res.status(200).json({ message: 'Appointment submitted successfully' });
    } catch (error) {
        console.error("Error saving appointment:", error);
        res.status(500).json({ error: 'Error saving appointment data' });
    }
});

// Route: Waitlist form
app.post('/submit-waitlist', async (req, res) => {
  const {
    name,
    email,
    phone,
    selectedLocation,
    otherLocation,
    selectedLayout,
    otherLayout
  } = req.body;

  console.log("Waitlist form data received:", req.body);

  try {
    const newWaitlist = new Waitlist({
      name,
      email,
      phone,
      selectedLocation,
      otherLocation,
      selectedLayout,
      otherLayout
    });

    await newWaitlist.save();
    console.log("Waitlist form submitted:", newWaitlist);
    res.status(200).json({ message: 'Waitlist form submitted successfully' });
  } catch (error) {
    console.error("Error saving waitlist form:", error);
    res.status(500).json({ error: 'Error saving waitlist form data' });
  }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
