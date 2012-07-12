module.exports = (function(){
	var mysql = require("mysql");
	return {
		connect: function(dbUrl, cb){
			var client = mysql.createConnection({
				host: dbUrl.hostname,
				port: dbUrl.port,
				database: dbUrl.pathname.split('/')[1],
				user: dbUrl.query.user,
				password: dbUrl.query.password
			});
			client.connect(function(err){
				if(err){
					dbUrl.error(err);
				}
				var table = dbUrl.pathname.split('/')[2] || "KEYVALUE",
					insert = "INSERT INTO " + table + " SET ?",
					select = "SELECT ? FROM " + table + " WHERE ?",
					update = "UPDATE " + table + " SET ? WHERE ?",
					del = "DELETE FROM " + table + "WHERE ?",
					db = {
					kv:{
						set: function(key, value, cb){
							client.query("UPDATE KEYVALUE SET ? WHERE ?", [{value: value}, {kkey: key}], function(err, rows){
								if(err){
									if(err.code === 'ER_NO_SUCH_TABLE'){
										client.query('CREATE TABLE KEYVALUE (kkey VARCHAR(255), value TEXT)', function(err){
											if(err){
												cb(err);
											}else{
												client.query("INSERT INTO KEYVALUE SET ?", {kkey: key, value: value},function(err, row){
													if(err){
														cb(err);
													}else{
														cb();
													}
												});
											}
										});
									}else{
										cb(err);
									}
								}else{
									if(rows.affectedRows === 1){
										cb();
									}else{
										if(rows.affectedRows === 0){
											client.query("INSERT INTO KEYVALUE SET ?", {kkey: key, value: value},function(err, row){
												if(err){
													cb(err);
												}else{
													cb();
												}
											});
										}else{
											cb(err);
										}
									}
								}
							});
						},
						get: function(key, cb){
							client.query("SELECT VALUE FROM KEYVALUE WHERE ?",{kkey: key}, function(err, rows, fields){
								if(err){
									if(err.code === 'ER_NO_SUCH_TABLE'){
										client.query('CREATE TABLE KEYVALUE (kkey VARCHAR(255), value TEXT)', function(err){
											if(err){
												cb(err);
											}else{
												cb();
											}
										});
									}
								}else{
									cb(undefined, rows[0]? rows[0]["VALUE"]: undefined);
								}
							});
						},
						del: function(key, cb){
							client.query("DELETE FROM KEYVALUE WHERE ?",{kkey: key}, function(err, rows, fields){
								if(err){
									if(err.code === 'ER_NO_SUCH_TABLE'){
										client.query('CREATE TABLE KEYVALUE (kkey VARCHAR(255), value TEXT)', function(err){
											if(err){
												cb(err);
											}else{
												cb();
											}
										});
									}else{
										cb(err);
									}
								}else{
									cb();
								}
							});
						}
					},
					crud:{
						create: function(query, cb){
							client.query(insert, query, cb);
						},
						retrive: function(query, cb){
							var qry = client.query(query.select, [query.fields, query.where]),
							cursor = {fields: null};
							qry
								.on("error", function(err){
									cursor.error(err);
								})
								.on("fields", function(fields){
									cursor.fields = fields;
								})
								.on("result", function(row){
									client.pause();
									cursor.each(row);
									client.resume();
								})
								.on("end", function(){
									cursor.each(undefined);
								});
							cb(cursor);
						},
						update: function(query, cb){
							client.query(update, query.set, query.get, cb);
						},
						del: function(query, cb){
							client.query(del, query, cb);
						}
					}
				};

				db.close = client.end;
				db.native = client;

				cb(db);
			});
		}
	};
}());