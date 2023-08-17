require("dotenv").config();
//require("./config/database").connect();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const User = require("./models/user");
const auth = require("./middleware/auth");
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const app = express();
const {Article} = require('./models');
const swaggerSpec = swaggerJSDoc(options);

app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.status(300).redirect('/articles');
})

app.get('/articles/create', (req, res) => {
  res.render('create');
})

// Get all Articles
app.get('/articles', (req, res) => {
  Article.findAll()
  .then(articles => {
    res.status(200).render('index', {articles});
  })
  .catch(err => {
    res.status(400).json({
      message: err.message
    })
  })
})

// Create
app.post('/articles', (req, res) => {
  console.log(req.body);
  const {title, body, approved} = req.body;
  Article.create({
    title,
    body,
    approved
  }).then((article) => {
    console.log(article)
    res.redirect('/articles')
  }).catch(err => {
    res.status(400).json("Can't create character")
  })
})

// Get Aricle by Id
app.get('/articles/:id', (req, res) => {
  Article.findByPk(req.params.id)
  .then(article => {
    if(article) {
      res.status(200).render('show', {
        title:article.title,
        body: article.body
      });
    } else {
      res.status(400).json({
        message: "ID character is Not Found"
      })  
    }
  })
  .catch(err => {
    res.status(400).json({
      message: err.message
    })
  })
})

app.get('/articles/update/:id', (req, res) => {
  Article.findByPk(req.params.id)
  .then(article => {
    if(article) {
      res.status(200).render('update', {article});
    } else {
      res.status(400).json({
        message: "ID character is Not Found"
      })  
    }
  })
  .catch(err => {
    res.status(400).json({
      message: err.message
    })
  })
})

// Update
app.put('/articles/:id', (req, res) => {
  const {title, body, approved} = req.body;
  Article.update(req.body, {
    where:{
      id:req.params.id
    }
  }).then((article) => {
    res.redirect('/articles')
  }).catch(err => {
    res.status(400).json(`Can't update character - ${err.message}`)
  })
})

// Update
app.put('/articles/update/:id', (req, res) => {
  const {title, body, approved} = req.body;
  Article.update(req.body, {
    where:{
      id:req.params.id
    }
  }).then((article) => {
    res.redirect('/articles')
  }).catch(err => {
    res.status(400).json(`Can't update character - ${err.message}`)
  })
})

// Delete
app.delete('/articles/:id', (req, res) => {
  index = req.params.id;
  console.log(index);
  console.log('Hello World')
  Article.destroy({
    where:{
      id:req.params.id
    }
  }).then((Article) => {  
    res.redirect('/articles')
  }).catch(err => {
    res.status(400).json(`Can't delete character - ${err.message}`)
  })
})

//JWT Register Login
app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

//Login auth
app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

//Welcome Walt Disney page
app.get("/articles", auth, (req, res) => {
  res.status(200).send("articles 🙌 ");
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
module.exports = app;
