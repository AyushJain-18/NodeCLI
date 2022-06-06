const clearHash = require('../services/cache').clearHash;
module.exports = async (req,res,next) => {
        await next(); // this will let our middelware to wait till next function call is completed
        console.log('middleware function runs')
        clearHash(req.user.id);
}