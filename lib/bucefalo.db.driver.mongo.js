module.exports = (function(){
	var mongo = require("mongodb"),
		Db = mongo.Db,
		Server = mongo.Server;
	return {
		connect: function(dbUrl, cb){
			var dbCollection = dbUrl.pathname.split('/'),
				dbName = dbCollection[1],
				collection = dbCollection[2],
				client = new Db(dbName, new Server(dbUrl.hostname, parseInt(dbUrl.port,10), {}));

			client.open(function(err, p_client) {
				if(err){
					dbUrl.error(err);
				}
				client.collection(collection, function (err, collection) {
					if(err){
						dbUrl.error(err);
					}
					var db = {
						kv:{
							set: function(key, value, cb){
								collection.save({_id: key, value: value}, {safe: true}, cb);
							},
							get: function(key, cb){
								collection.findOne({_id: key}, function(err, doc){
									cb(err, doc ? doc.value: undefined);
								});
							},
							del: function(key, cb){
								collection.remove({_id: key}, {safe: true}, cb);
							}
						},
						crud:{
							create: function(query, cb){
								collection.insert(query, {safe: true}, cb);
							},
							retrive: function(query, cb){
								collection.find(query, cb);
							},
							update: function(query, cb){
								collection.update(query.criteria, query.update,{safe: true}, cb);
							},
							del: function(query, cb){
								collection.remove(query, {safe: true}, cb);
							}
						}
					};

					db.close = client.close;
					db.native = collection;

					cb(db);
				});
			});
		}
	};
}());