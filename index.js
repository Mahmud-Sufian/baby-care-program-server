const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient; 
require('dotenv').config()

 

const app = express();
app.use(bodyParser.json());
app.use(cors());
 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wnxc8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', (req, res) => {
  res.send('Hello World!')
});


client.connect(err => { 
  const programCollection = client.db("programs").collection("services");
  const applyCollection = client.db("programs").collection("apply");
  const reviewCollection = client.db("programs").collection("review");
  const teacherCollection = client.db("programs").collection("teacher");


  // Our Programs data--------
  app.post('/addAProgram', (req, res) => {
    programCollection.insertOne(req.body)
    .then(result => {
       res.send(result.insertedCount > 0);
    })
  });

  app.get('/getPrograms', (req, res) => {
    programCollection.find({})
    .toArray( (err, document) => {
      res.send(document);
    })
  });

  app.delete('/programDelete/:id', (req, res) => {
    programCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  });

  app.get('/getSingleProgram/:id', (req, res) => {
    programCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, document) => {
      res.send(document[0]);
    })
  });


  // Customer applied data----------
  app.post('/apply', (req, res) => {
    applyCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  });

  app.get('/getApply', (req, res) => {
    applyCollection.find({})
    .toArray( (err, document) => {
      res.send(document);
    })
  });

  app.post('/appliedByEmail', (req, res) => {
    const email = req.body.email; 
    applyCollection.find({email: email})
     .toArray( (err, document) => {
       res.send(document);
     })
  });

  app.delete('/delete/:id', (req, res) => {
    applyCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  });


  // Customer review data----------
  app.post('/addReview', (req, res) => {
    reviewCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  });

  app.get('/getReview', (req, res) => {
    reviewCollection.find({})
    .toArray( (err, document) => {
      res.send(document);
    })
  });

  


  // my Teacher/admin data-------
  app.post('/addATeacher', (req, res) => {
    teacherCollection.insertOne(req.body)
    .then(result => {
       res.send(result.insertedCount > 0);
    })
  });

  app.get('/ourTeacher', (req, res) => {
    teacherCollection.find({})
    .toArray( (err, document) => {
      res.send(document);
    })
  });

  app.post('/findTeacher', (req, res) => {
    const email = req.body.email; 
    teacherCollection.find({ email: email })
        .toArray((err, doctors) => {
            res.send(doctors.length > 0);
        })
  })


});



app.listen(process.env.PORT || 4200, () => console.log('this port is running'))