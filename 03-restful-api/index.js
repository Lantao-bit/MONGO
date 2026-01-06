// REQUIRES
// from node_modules drectory by default; 
// get db.js from the same directory as index.js
const express = require('express');   
require('dotenv').config();  // put the variables in the .env file into process.env
const cors = require('cors');
const { connect } = require("./db");  
const { ObjectId } = require('mongodb');

// SETUP EXPRESS
const app = express();
app.use(cors()); // enable CORS for API
app.use(express.json()); // tell Express that we are sending and reciving JSON

// SETUP DATABASE
const mongoUri = process.env.MONGO_URI;
const dbName = "recipe_book";

async function main() {
    const db = await connect(mongoUri, dbName);

    // ROUTES - default
    app.get('/', function (req, res) {
        res.json({
            "message": "Hello world"
        })
    });

    // ROUTES - /recipes
    app.get('/recipes', async function(req,res){
        const recipes = await db.collection('recipes').find().project({
            name: 1, cuisine: 1, tags: 1, prepTime: 1
        }).toArray();
        res.json({
            "recipes": recipes
        })
    })

    // ROUTES - post recipe
    // tags: ["quick", "easy", "vegetarian"]
    app.post('/recipes', async function(req,res){
        // extract out the various components of the recipe document from req.body
        // const name = req.body.name;
        // const cuisine = req.body.cuisine;
        // const prepTime = req.body.prepTime;
        // const cookTime = req.body.cookTime;
        // const servings = req.body.servings;
        // const ingredients = req.body.ingredients;
        // const instructions = req.body.instructions;
        // const tags = req.body.tags;

        // use object destructuring to extract each components from req.body
        const {name, cuisine, prepTime, cookTime, servings, ingredients, instructions, tags} = req.body;

        // basic validation
        if (!name || !cuisine || !ingredients || !instructions || !tags || !prepTime || !cookTime || !servings) {
            // HTTP 400 error code = Bad request
            return res.status(400).json({
                error: "Missing required fields"
            })
        }

        // validate the cuisine
        const cuisineDoc = await db.collection('cuisines').findOne({
            name: cuisine
        });

        if (!cuisineDoc) {
            return res.status(400).json({
                error: "Error. Cuisine not found"
            })
        }

        // validate the tags

        // find the tags from the database
        const tagDocs = await db.collection('tags').find({
            "name": {
                $in: tags
            }
        }).toArray();

        // check if the number of tags that we have found matches the length of the tags array
        if (tagDocs.length != tags.length ) {
            return res.status(400).json({
                'error':"One or more tags is invalid"
            })
        }

        const newRecipe = {
            _id: new ObjectId(),  // optional, 'cos when Mongo inserts a new document, it will ensure that an _id
            name,
            cuisine: {
                _id: cuisineDoc._id,
                name: cuisineDoc.name
            },
            prepTime,
            cookTime,
            servings,
            ingredients, 
            instructions,
            tags: tagDocs
        }

        const result = await db.collection('recipes').insertOne(newRecipe);
        res.status(201).json({
            message: "Recipe created",
            recipeId: result.insertedId
        })
    })
    // put a recipe 
//    app.put('/recipes/:id', async function (req, res) {
//        const recipeId = req.params.id;
//       const status = await validateRecipe(db, req.body);
//        if (status.success) {
//            // update the recipe
//            const result = await db.collection('recipes').updateOne({
//                _id: new ObjectId(recipeId)
//            }, {
//                $set: status.newRecipe
//            });
//            res.json({
//                'message': "Recipe has been updated successful"
//            })
//        } else {
//            res.status(400).json({
//                error: status.error
//            })
//        }
//    })

    // delete a recipe 
    app.delete('/recipes/:id', async function (req, res) {
        try {
            const recipeId = req.params.id;
            const results = await db.collection('recipes').deleteOne({
                _id: new ObjectId(recipeId)
            });

            if (results.deletedCount === 0) {
                return res.status(404).json({
                    "error":"Not found"
                })
            }

            res.json({
                'message':'Deleted successfully'
            })
        } catch (e) {
            res.status(500).json({
                'error':'Internal Server Error'
            })
        }

    })
}

main();

// START SERVER
app.listen(3000, function () {
    console.log("Server has started");
})