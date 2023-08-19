require("dotenv").config();
require("./config/database").connect();
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
const {Character: Character} = require('./models');
const {Movie: Movie} = require('./models/films');
const swaggerSpec = swaggerJSDoc(options);
const post = await Post.create({ title: 'Paranoid test' });

app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.set('view engine', 'ejs');
let createTransport = nodemailer.createTransport(jConfig);
app.get('/', (req, res) => {
  res.status(300).redirect('/characters');
})

console.log(post instanceof Post);

class Post extends Model {}
Post.init({}, {
  sequelize,
  paranoid: true,
  deletedAt: 'Imagen'
});

app.get('/characters/create', (req, res) => {
  res.render('create');
})

app.get('/movies/create', (req, res) => {
  res.render('create');
})

// Get all Character
app.get('/characters', (req, res) => {
  Character.findAll()
  .then(character => {
    res.status(200).render('index', {characters: character});
  })
  .catch(err => {
    res.status(400).json({
      message: err.message
    })
  })
})

// Get all Movies
app.get('/movies', (req, res) => {
  Movie.findAll()
  .then(movie => {
    res.status(200).render('index', {movies: movie});
  })
  .catch(err => {
    res.status(400).json({
      message: err.message
    })
  })
})
 
// Create Walt Disney Character
app.post('/characters', (req, res) => {
  console.log(req.body);
  const {Imagen, Nombre} = req.body;
  Character.create({
    Imagen,
    Nombre
  }).then((character) => {
    console.log(character)
    res.redirect('/character')
  }).catch(err => {
    res.status(400).json("Can't create character")
  })
})

// Get character by Id
app.get('/characters/:id', (req, res) => {
  Character.findByPk(req.params.id)
  .then(character => {
    if(character) {
      res.status(200).render('show', {
        Imagen:character.Imagen,
        Nombre: character.Nombre
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

// Get Movies by Id
app.get('/movies/:id', (req, res) => {
  Movie.findByPk(req.params.id)
  .then(movie => {
    if(movie) {
      res.status(200).render('show', {
        Imagen:movie.Imagen,
        Título: movie.Título,
        Fecha: movie.Fecha,
        Calificación: movie.Calificación,
        Personajes: movie.Personajes
      });
    } else {
      res.status(400).json({
        message: "ID movie is Not Found"
      })  
    }
  })
  .catch(err => {
    res.status(400).json({
      message: err.message
    })
  })
})

// Get Movies by Name
app.get('/movies/:name', (req, res) => {
  Movie.findByPk(req.params.name)
  .then(movie => {
    if(movie) {
      res.status(200).render('show', {
        Imagen:movie.Imagen,
        Título: movie.Título,
        Fecha: movie.Fecha,
        Calificación: movie.Calificación,
        Personajes: movie.Personajes
      });
    } else {
      res.status(400).json({
        message: "Name movie is Not Found"
      })  
    }
  })
  .catch(err => {
    res.status(400).json({
      message: err.message
    })
  })
})

// Get waltDisney characters
app.get('/characters/update/:id', (req, res) => {
  Character.findByPk(req.params.id)
  .then(character => {
    if(character) {
      res.status(200).render('update', {character: character});
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

// Update WaltDisney character
app.put('/characters/:id', (req, res) => {
  const {Imagen, Nombre} = req.body;
  Character.update(req.body, {
    where:{
      id:req.params.id
    }
  }).then((character) => {
    res.redirect('/characters')
  }).catch(err => {
    res.status(400).json(`Can't update character - ${err.message}`)
  })
})

// Update characters by id
app.put('/characters/update/:id', (req, res) => {
  const {Imagen, Nombre} = req.body;
  Character.update(req.body, {
    where:{
      id:req.params.id
    }
  }).then((character) => {
    res.redirect('/characters')
  }).catch(err => {
    res.status(400).json(`Can't update character - ${err.message}`)
  })
})

// Delete character by id
app.delete('/characters/:id', (req, res) => {
  index = req.params.id;
  console.log(index);
  console.log('Hello World')
  Character.destroy({
    where:{
      id:req.params.id
    }
  }).then((Character) => {  
    res.redirect('/characters')
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
app.get("/characters", auth, (req, res) => {
  res.status(200).send("characters 🙌 ");
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

// Define JSON variable for smtp config gmail provider
let jConfig = {
  "host":"smtp.gmail.com", 
  "port":"465", 
  "secure":false, 
  "auth":{ 
        "type":"login", 
        "user":"test@gmail.com", 
       "pass":"admin" 
}
};

// Define body mail 
let email ={ 
  from:"test@gmail.com",  
  to:"guitarrajulian@hotmail.com",
  subject:"WalTDisney Test",
  html:` 
      <div> 
      <p>Hola amigo</p> 
      <p>Esto es una prueba de waltDisney</p> 
      <p>¿Cómo enviar correos eletrónicos con Nodemailer en NodeJS </p> 
      </div> 
  ` 
};

// sendMail method Nodemailer transport 
createTransport.sendMail(email, function (error, info) { 
  if(error){ 
       console.log("Error to send mail"); 
  } else{ 
       console.log("Mail send success!!"); 
  } 
  createTransport.close(); 
});

// Paranoid post find by id
await Post.findByPk(123);

// Paranoid post all 
await Post.findAll({
  where: { Title: 'mickey' }
});

// Paranoid Destroy by id
await Post.destroy({
  where: {
    id: 1
  }
});

// Restore
await Post.restore({
  where: {
    likes: {
      [Op.gt]: 100
    }
  }
});

// Define swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
module.exports = app;
