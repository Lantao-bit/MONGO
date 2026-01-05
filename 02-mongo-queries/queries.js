// to show all databases on the cluster
show databases;

// we want to work with one of the database
use sample_airbnb;

// see all the collections
show collections;

//  the variable `db` will refer to the current active database
// then we use the dot syntax to refer to the collection
// so db.listingsAndReviews will refer to the `listingsAndReviews` collection
// in the current active database

// to show all documents in a collection
db.listingsAndReviews.find();

// .limit function to show only a couple of documents
db.listingsAndReviews.find().limit(2);

// Projection - tells Mongo which keys we want

// only show the name, description, address and beds key
db.listingsAndReviews.find({},{
    "name": 1,
    "description": 1,
    "address": 1,
    "beds": 1
});

// search by the criteria

// find by value
// find all listings that have 2 beds
db.listingsAndReviews.find({
    "beds": 2,
}, {
    "name": 1,
    "beds": 1
});

// find all listings that have 2 beds and 2 bathrooms
db.listingsAndReviews.find({
    "beds": 2,
    "bathrooms": 2
}, {
    "name": 1,
    "beds": 1,
    "bathrooms": 1
});

// find all listings from Brazil
db.listingsAndReviews.find({
    "address.country":"Brazil"
},{
    "name": 1,
    "address.country": 1
})

// .count() will return the total number of listings
// Show how many listings are in Brazil
db.listingsAndReviews.find({
    "address.country":"Brazil"
}).count();

// .distinct("<key">) will show all the unique values for key
db.listingsAndReviews.distinct("address.country");

// find all the listings in Brazil that has 2 beds 
db.listingsAndReviews.find({
    "beds": 2,
    "address.country":"Turkey"
},{
    "name": 1,
    "beds": 1,
    "address.country": 1
})

// finding by a range
// find all listings that have at least 2 beds
// $gt => greater than
// $lt => lesser than
// $gte => greater than or equal
// $lte => lesser than or equal
// $nq => not equal
// $eq => equals
db.listingsAndReviews.find({
    "beds": {
        "$gt": 2
    }
},{
    'name': 1,
    'beds': 1
})

// find between 2 to 4 beds
db.listingsAndReviews.find({
    "beds": {
        "$gte": 2,
        "$lte": 4
    }
},{
    'name': 1,
    'beds': 1
})


// find between 2 to 4 beds
// and the price is less than or equal to $200
db.listingsAndReviews.find({
    "beds": {
        "$gte": 2,
        "$lte": 4
    }, 
    "price": {
        "$lte": 200
    }
},{
    'name': 1,
    'beds': 1,
    "price": 1
})