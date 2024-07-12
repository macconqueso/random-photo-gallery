const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const { getAverageColor } = require('fast-average-color-node'); // Import the function directly
const Gallery = require('./models/gallery');

// Express App
const app = express();

// Connection to MongoDB (database)
const dbURI = 'mongodb+srv://macalynhoward:KJu1WYaR309eZGPf@random-photo-gallery.5zr6ysk.mongodb.net/?retryWrites=true&w=majority&appName=Random-Photo-Gallery';
mongoose.connect(dbURI)
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err));

// Allows access to CSS file
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(morgan('dev'));

// Routes
app.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ date: -1 });
    res.render('index', { title: 'Random Photo Gallery', name: 'Connor', images });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving images from database');
  }
});

app.get('/add-image', (req, res) => {
  res.render('add-image', { title: 'Add Image', name: 'Connor' });
});

app.post('/add-image', async (req, res) => {
  const { title, url, date } = req.body;
  console.log(req.body); // Log the incoming request body

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    
    const dominantColor = await getAverageColor(imageBuffer); // Use the getAverageColor function directly

    const newImage = new Gallery({
      imageTitle: title,
      imageURL: url,
      date: new Date(date),
      dominantColor: dominantColor.hex
    });

    await newImage.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error saving image', err);
    res.status(500).send('Error saving image to database');
  }
});

app.use((req, res) => {
  res.status(404).render('404', { title: '404', name: 'Connor' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



