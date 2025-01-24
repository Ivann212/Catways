const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const path = require('path')
const UserModel = require('./models/users.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require("./middleware/auth");
const cookieParser = require('cookie-parser'); 
const methodOverride = require('method-override');
const { isAdmin } = require('./middleware/auth')


const port = 3000


connectDB();

const app = express();

app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}))

app.use("/users", require("./routes/users"));
app.use("/catways", require("./routes/catways"));
app.use("/dashboard", require("./routes/dashboard"));



app.get("/", (req, res) => {
    res.render("index"); 
});

app.get("/documentation", (req, res) => {
    res.render("documentation"); 
});
// logique pour gérer le login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Trouver l'utilisateur dans la base de données
  const user = await UserModel.findOne({ email });

  if (!user || user.role !== 'admin') {
    return res.status(400).json({ message: 'Utilisateur non trouvé ou accès réservé aux administrateurs.' });
  }

  // Comparer le mot de passe saisi avec le mot de passe haché dans la base de données
  const match = await bcrypt.compare(password, user.password); 

  if (!match) {
    return res.status(400).json({ message: 'Mot de passe incorrect.' });
  }

  // Si le mot de passe correspond, on génère un token JWT
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Envoyer le token dans un cookie ou le retour dans la réponse
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/dashboard');  
});



  


app.listen(port, () => console.log("le serveur à démarrer sur le port " + port))