module.exports = (req, res, next) => {
  console.log('login middelware')
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  next();
};
