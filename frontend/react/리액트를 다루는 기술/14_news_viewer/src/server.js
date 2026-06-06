const express = require('express');
const app = express(); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
const port = 3001; 
const axios = require('axios'); 
app.use(cors()); 
app.use(bodyParser.json()); 
app.use('/news', (req, res) => { 
    const category = req.query.category;
    const query = category === 'all' ? '' : `&category=${category}`;
    axios.get('http://newsapi.org/v2/top-headlines' +
    `?country=kr${query}` +
    '&apiKey=80c7785acfbd48448a82e895b4629224'
    ).then(function(response) { 
      res.send(response.data);
    }).catch(function(error) { 
      res.send(error);
    });
  });

app.listen(port, () => { 
  console.log(`express is running on ${port}`);
});