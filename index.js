const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');
const logger = require('./middleware/logger');

const server = express();
const port = 8000;

server.use(express.json());
server.use(logger());
server.use('/users', userRouter);
server.use('/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use((req, res) => {
    res.status(404).json({
        message: "route not found"
    })
});

server.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        message: 'something went wrong'
    })
})

server.listen(port, () => {
    console.log(`server listening on port: ${port}`);
})

