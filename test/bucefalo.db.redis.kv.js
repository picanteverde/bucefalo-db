var expect = require("chai").expect,
	db = require("../index.js");

describe ("Bucefalo Data Bases Redis Driver Key Value", function(){
	var dbUrl = "redis://localhost:6379/";

	it('should allow to conect to localhost',function(done){
		db.kv(dbUrl, function(db){
			db.set("test1","value1", function(err){
				expect(err).to.not.ok;
			});
			db.get("test1",function(err, value){
				expect(value).to.equal("value1");
				done();
			});
		});
	});
	
	it('should store values',function(done){

		db.kv(dbUrl, function(db){
			db.set("test1","value1", function(err){
				expect(err).to.not.ok;
			});
			db.get("test1",function(err, value){
				expect(value).to.equal("value1");
			});
			db.set("test2","value2", function(err){
				expect(err).to.not.ok;
			});
			db.get("test2",function(err, value){
				expect(value).to.equal("value2");
				done();
			});
		});
		
	});

	it('should delete a value', function(done){
		db.kv(dbUrl, function(db){
			db.set("test3","value3", function(err){
				expect(err).to.not.ok;
				db.get("test3",function(err, value){
					expect(value).to.equal("value3");
					db.del("test3",function(err){
						expect(err).to.not.ok;
						db.get("test3",function(err, value){
							expect(err).to.not.ok;
							expect(value).to.not.be.ok;
							done();
						});
					});
				});
			});
		});
	});

});