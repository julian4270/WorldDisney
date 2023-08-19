const {Character: Character, sequelize} = require('./models/')

let characterFilm;

Character.create({
  title:'El pato Donald',
  body:'El pato donald y sus amigos',
  approved:true
}).then((character) => {
  console.log(character)
})

console.log(characterFilm);

// Update Cara 1
Character.update({
  title:"Mickey Mouse",
  body:"Mickey Mouse y sus amigos"
},{
  where:{
    id:2
  }
}).then(() => {
  console.log("film updated")
  return null;
}).catch(err => {
  console.error(`Error film update - ${err.message}`)
})

sequelize.query(`UPDATE "personaje" SET approved=false where id = 2`)
  .then(() => console.log('film updated'))

// Find All
Character.findAll({
  attributes:['title','body'],
  order:[
    ['title', 'desc']
  ]
}).then((characters) => {
  characters.map(characters => {
    const data = {
      id: characters.id,
      title: characters.title,
      body: characters.body,
      approved: characters.approved
    }
    console.log(data)
  })
})

// Find One
Character.findOne({
  where:{
    approved:false
  }
}).then((character) => {
  const data = {
    id: character.id,
    title: character.title,
    body: character.body,
    approved: character.approved
  }
  console.log("=======================================")
  console.log(data)
})

// Find by Primary Key
Character.findByPk(3).then((character) => {
  const data = {
    id: character.id,
    title: character.title,
    body: character.body,
    approved: character.approved
  }
  console.log("***************************************")
  console.log(data)
})

// Find and Count All
Character.findAndCountAll().then((character) => {
  console.log('.......................................')
  console.log(character)
  character.rows.map(character => {
    const data = {
      id: character.id,
      title: character.title,
      body: character.body,
      approved: character.approved
    }
    console.log(data)
  })
})

// Delete
Character.destroy({
  where:{
    id:3
  }
}).then(() => console.log("deleted"))
