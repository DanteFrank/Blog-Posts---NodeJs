const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const morgan = require('morgan')
const connectDB = require('./config/db')

//Load Config 
dotenv.config({path: './config/config.env'})

//Passport Config
require('./config/passport')(passport)

//Conect DB
connectDB()

const app = express()

//Morgan Login
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlesbars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');


//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))


//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


//Static Folders
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))

