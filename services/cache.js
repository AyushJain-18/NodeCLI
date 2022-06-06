const redis         = require('redis');  
const redisUrl      = require('../config/keys').redisUrl
const client        = redis.createClient(redisUrl);


const util = require('util');
client.hget = util.promisify(client.hget);

const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options ={}){
    this.useCache = true;
    this.hashKey  = JSON.stringify(options.key || '');
    return this;
}

mongoose.Query.prototype.exec = async function(){
    if(!this.useCache){
        console.log('DATA fetched');
        return exec.apply(this, arguments);
    }
    let key = JSON.stringify({...this.getQuery(), collection: this.mongooseCollection.name});

    // 1. make call for key in redis server
    let cachedData = await client.hget(this.hashKey, key);
    // if cached Data present return cached data else make call to mongoDB
    if(cachedData){ 
        console.log('DATA Served from cache');
            let doc = JSON.parse(cachedData);
           return Array.isArray(doc)
            ? doc.map(d =>   new this.model(d))
            : new this.model(doc);
    }
    const result = await exec.apply(this, arguments);
    console.log('DATA added to cache',this.hashKey,  key);
    client.hset(this.hashKey,key, JSON.stringify(result));
    return result;
}


const clearHash = (hashKey) => {
    client.del(JSON.stringify(hashKey));
 }

module.exports ={
    clearHash
}