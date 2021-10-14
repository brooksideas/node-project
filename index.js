const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./router/auth');
const users = require('./router/users');
const ideas = require('./router/ideas');
const app = express();

if(!config.get('jwtPrivateKey')){
  console.log('FATAL ERROR: JWT Private Key is not Defined.')
  process.exit(1); // 0 is success others is failure
}

mongoose.connect('mongodb://localhost/Eureka')
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.log('Could not connect to MongoDB', error))

app.use(express.json()); //middleware
app.use('/api/auth', auth); // routes
app.use('/api/users', users);  
app.use('/api/ideas', ideas);
 
app.get('/', (req, res) => {
  res.send('Hello Brook!')
}); 

app.listen(5000, () => {
  console.log('Listening on port 5000!')
});