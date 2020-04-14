module.exports = () => {
    return (req, res, next) => {
        console.log(`Time: ${new Date().toString()}, Method: ${req.method}, URL: ${req.url}`);
        next();
    }
}