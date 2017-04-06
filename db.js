var MongoClient = require('mongodb').MongoClient ;

var newURL = (newUrl , callback) => {

        connect( (err , db) => {
            if(err){
                callback(err , undefined);
            } else {
                var index = autoIndex(db , (err ,  index) => {
                    if (err) {
                        callback(err , undefined)
                    } else {
                        db.collection('urls').insertOne( {
                            'original_url' : newUrl ,
                            'short_url' : `https://urlshortner-fcc.herokuapp.com/${index}` ,
                            'index' : index
                        }  , (err , res) => {
                            if(err){
                                callback("Unable to Insert"  ,  undefined);
                            } else {
                                callback(undefined , {
                                    'original_url' : newUrl ,
                                    'short_url' : `https://urlshortner-fcc.herokuapp.com/${index}`
                                });
                            }
                        });
                    }

                });
            }
        });
};


var findURL = (index , callback) => {


    connect( (err , db) => {
        if(err){
            callback(err , undefined);
        } else {
            db.collection('urls').findOne( {
                'index' : index
            } , (err , res ) => {
                if (res) {
                    var url = res['original_url']
                    callback(undefined , url)
                } else {
                    callback("Unable to Find  URL"  , undefined);

                }
            });
        }
    });

};


var connect =  (callback) => {

    var url = 'mongodb://localhost:27017/test';
    var urlweb = process.env.MONGOLAB_URI ;

    MongoClient.connect(urlweb, function (err, db) {
      if (err) {
        callback(err , undefined)
      } else {
        console.log('Connection established to', urlweb);
        callback(undefined , db)
      }
    });

};

var autoIndex = (db , callback) => {
    db.collection('urls').findOne( {
        '_id' : 0
    } , (err , res ) => {
        if (res) {
            var index = res['lastIndex']
            db.collection('urls').updateOne({
                '_id' : 0
            }, {
                'lastIndex' : index + 1
            } , (err , res) => {
                if (err){
                    callback(err  , undefined);
                } else {
                    callback(undefined , index+1) ;
                }
            });
        } else {
            db.collection('urls').insertOne( {
                '_id' : 0 ,
                'lastIndex' : 1
            }  , (err , result) => {
                if(err){
                    callback("Unable to Insert"  ,  undefined);
                } else {
                    callback(undefined , 1 );
                }
            });
        }
    });

};

module.exports = {
    newURL ,
    findURL
} ;
