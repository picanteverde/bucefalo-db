module.exports = (function(){
	var redis = require("redis");
	return {
		connect: function(dbUrl, cb){
			var client = redis.createClient(dbUrl.port, dbUrl.hostname),
				db = {
					error: dbUrl.error,
					kv:{
						set: function(key, value, cb){
							client.set(key,value, cb);
						},
						get: function(key, cb){
							client.get(key, cb);
						},
						del: function(key, cb){
							client.del(key, cb);
						}
					},
					crud:{
						create: function(query, cb){
							client.set(query.key, query.value, cb);
						},
						retrive: function(query, cb){
							client.get(query, cb);
						},
						update: function(query, cb){
							client.set(query.key, query.value, cb);
						},
						del: function(query, cb){
							client.del(query, cb);
						}
					}
				};

			client.on("error", function (err) {
				dbUrl.error(err);
			});

			db.close = client.quit;
			db.native = client;
			
			cb(db);
		}
	};
}());