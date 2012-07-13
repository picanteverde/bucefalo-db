Bucefalo DataBases
=============

Bucefalo Simple database access model for node.js.


Access Model
------------

Usually we tend to use our data storage to do some simple tasks like saving some key value data or just accessing one single data structure, such as a table or a collection. The intention of bucefalo-db is to provide a simple factory based on a url to instantiate database drivers to most popular DBMSs by offering a similar interface avoiding the driver details on connection and queries, but also providing all the driver native methods for more specific task, and not hidding the DBMS filosofy behind, which means if you are conected to SQL RDBMS system you specify your queries in SQL language (even in the dialects from your specific vendor) and the resulset retrieved is defined by the driver specifications. The only thing we are doing is hidding the details on connecting and queries.

How to use
------------

### Using the Key Value Store
Accessing key value store as never been so simple

    var db = require("../index.js"),
        dbUrl = "mysql://localhost:3306/test";
    db.kv(dbUrl, function(db){
        db.set("test1","value1", function(err){
          expect(err).to.not.ok;
            db.get("test1",function(err, value){
            expect(value).to.equal("value1");
            done();
          });
        });
      });


Current Drivers
---------------
This is the list of the currently implemented drivers

* Mysql
* Redis (hiredis)
* MongoDB