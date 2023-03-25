//Deployment
const express = require('express');
//const severless=require("serverless-http");
//const router=express.router()

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _=require("lodash");
const path=require('path');
//const date=require(__dirname+"/Date.js");
//const express=require('express');
const app = express();

//var items = ["DSA", "Web Development", "AI ML"];
//var workItems = [];

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.engine('ejs', require('ejs').renderFile);


//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
    var today = new Date();
    var currentDay = today.getDay();
    //currentDay = 0 to 6: Sunday to Saturday

    if (currentDay == 6 || currentDay == 0) {
        res.write("Yay! It's the weekend!");
        res.send();
    }
    else {
        res.write("It's not the weekend.");
        res.write("Boo, I have to work!");
        res.send();
    }
*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//Mongoose, Model and Schema
//mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://admin-haripriya:Test123@cluster0.gpchac4.mongodb.net/todolistDB", { useNewUrlParser: true });
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Why no name?"]
    }
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
    name: "Welcome to your TO-DO LIST!"
})
const item2 = new Item({
    name: "Hit the + button to add a new item."
})
const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const DSA = new Item({
    name: "DSA"
})
const WEBDEV = new Item({
    name: "Web Developemnt"
})
const AIML = new Item({
    name: "AI ML"
})

const defaultItems = [item1, item2, item3];


//Custom To-Do Lists
const listSchema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);



//Routing
app.get('/', function (req, res) {
    //var day=date.getDate();//give listTitle: day

    Item.find({})
        .then(function (foundItems) {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems)
                    .then(function () {
                        console.log("Successfully Inserted.");
                    })
                    .catch(function (err) {
                        console.log(err);
                    })

                res.redirect("/")
            }
            else {
                res.render("list", { listTitle: "Today", newListItems: foundItems });
            }
        })
        .catch(function (err) {
            console.log(err);
        })
})

app.get("/about", function (req, res) {
    res.render("about");
})

app.get("/:customListName", function (req, res) {
    //res.render("list", { listTitle: "Work List", newListItems: workItems });

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
        .then(function (foundList) {
            if (!foundList) {
                //console.log("Doesn't exist!");
                //create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            }
            else {
                //show an existing list
                //console.log("Exists");

                res.render("list", { listTitle: customListName, newListItems: foundList.items })
                //res.redirect("/"+customListName);
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post("/", function (req, res) {
    var itemName = req.body.newItem;
    var listName = req.body.list;

    //create a new document.
    const newItem = Item({
        name: itemName
    });

    if (listName === "Today") {
        newItem.save();
        console.log("Added one item to the list");
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName })
            .then(function (foundList) {
                foundList.items.push(newItem);
                foundList.save();
                console.log("Added one item to the custom list");
                res.redirect("/" + listName)
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    // if (req.body.list==="Work") {
    //     workItems.push(item);
    //     console.log(req.body);
    //     res.redirect("/work");
    // }
    // else {
    //     items.push(item);
    //     console.log(req.body);
    //     res.redirect("/");
    // }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkedBox;
    const listName = req.body.listName;
    //console.log(listName);

    if (listName == "Today") {
        Item.findByIdAndRemove(checkedItemId)
            .then(() => {
                console.log("Removed One item from the list.");
                res.redirect("/");
            })
            .catch((err) => {
                console.log(err);
            })
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
            .then(function (foundItems) {
                console.log("Deleted one item from a custom list");
                res.redirect("/" + listName);
            })
            .catch(function (err) {
                console.log(err);
            })
    }
})






app.listen(8000, () => {
    console.log("Server started on port 8000");
})


//app.use('/.netlify/functions/api', app);
//module.exports.handler=severless(app);