module.exports = (function(){
	var url = require('url'),
	getDriver = function(conn, cb){
		var dbUrl = url.parse(conn, true),
			mappings = function(db){
				db.kv.s = db.kv.set;
				db.kv.g = db.kv.get;
				db.crud.c = db.crud.create;
				db.crud.r = db.crud.retrive;
				db.crud.u = db.crud.update;
				db.crud.d = db.crud.del;
				db.kv.toCrud = db.crud;
				db.crud.toKv = db.kv;
				db.kv.close = db.crud.close = db.close;
				db.kv.native = db.crud.native = db.native;
				db.onError = db.kv.onError = db.crud.onError = function(fn){
					if(dbUrl.errors !== undefined){
						dbUrl.forEach(function(err){
							fn(err);
						});
					}
					dbUrl.fnError = fn;
				};
				return db;
			},
			drv;
		dbUrl.error = function(err){
			if(typeof(dbUrl.fnError) !== "function"){
				if(dbUrl.errors === undefined){
					dbUrl.errors = [];
				}
				dbUrl.errors.push(err);
			}else{
				dbUrl.fnError(err);
			}
		};
		switch(dbUrl.protocol){
			case "redis:":
				drv = require("./lib/bucefalo.db.driver.redis.js");
				break;
			case "mongo:":
				drv = require("./lib/bucefalo.db.driver.mongo.js");
				break;
			case "mysql:":
				drv = require("./lib/bucefalo.db.driver.mysql.js");
				break;
		}
		drv.connect(dbUrl, function(db){
			cb(mappings(db));
		});
	};

	return {
		kv: function(conn, cb){
			getDriver(conn, function(db){
				cb(db.kv);
			});
		},
		crud: function(conn, cb){
			getDriver(conn, function(db){
				cb(db.crud);
			});
		},
		native: function(conn, cb){
			getDriver(conn, function(db){
				cb(db.native);
			});	
		}
	};
}());
