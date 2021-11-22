const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();
const path = require("path");
const fs = require('fs').promises;
const database_file = 'database.json';

// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/homepage", (req, res) => {

  res.render("homepage");
});

app.get("/people/:id", (req, res) => {
  let id_to_find = req.params.id;
  if(id_to_find){
    fs.readFile(path.join(__dirname, database_file), 'utf-8')
    .then(users => {
      const database = JSON.parse(users);
      const user_found = database.users.find(x => x.id === id_to_find);
      if(user_found){
        res.render('people', {user_found});
      }
      else{
        res.redirect('/');
      }
    })
  }
});

app.get("/:id/photos", (req, res) => {
  const id = req.params.id;
});

app.get("/", (req, res) => {
  res.render("createcard");
});

app.post("/", (req, res) => {
  const data = {
    "id": `${Date.now()}`,
    "fullName": req.body.name,
    "aboutMe": req.body.about,
    "knownTechnologies": [],
    "githubUrl": req.body.git_hub,
    "twitterUrl": req.body.twitter,
    "favoriteBooks": (req.body.books).split(','),
    "favoriteArtists": (req.body.artists).split(',')
  };
  console.log(data);

  fs.readFile(path.join(__dirname, database_file), 'utf-8')
  .then(users => {
    const database = JSON.parse(users);
    if(!database.users.find(x => x.fullName === req.body.name)){
      database.users.push(data);
      (fs.writeFile(path.join(__dirname, database_file), JSON.stringify(database)))
    }
  })
  .catch(err => console.log(err));

  res.redirect('/');
})

app.listen(PORT, () => {
  console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});
