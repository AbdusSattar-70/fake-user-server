const express = require('express');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const userRouter = require('./routes/userRouter');

const app = express();

const PORT = 3500;

// custom middleware logger
app.use(logger);



// Cross Origin Resource Sharing
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

// built-in middleware for json
app.use(express.json());

app.use('/api', userRouter);

// default errror handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
