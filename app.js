require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');

const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.use(errorController.get404);

app.use(errorController.errorHandler);

sequelize
// .sync({ force: true })
.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});
