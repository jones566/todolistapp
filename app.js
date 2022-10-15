const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();



mongoose.connect("mongodb+srv://admin-Jones:Malachi456.@atlascluster.gps7jki.mongodb.net/todolistappDB");
const itemsSchema = new mongoose.Schema({
                   name: String
                   });
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
              name: "running"
});
const item2 = new Item({
              name: "Eating"
});
const item3 = new Item({
              name: "Bathing"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
                   name: String,
                   items: [itemsSchema]
                   });
const List = mongoose.model("List", listSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) =>{
	Item.find({}, (err, foundItem) => {
		if (foundItem.length === 0) {
			Item.insertMany(defaultItems, (err) => {
                if (err) {console.log(err);}
                else{console.log("Item is successfully inserted into the database");}
			});
			res.redirect("/");
		}
		else{

	        res.render('list', {listTitle: "Today", newListItems: foundItem});
		}	
	});
});

app.get("/:customListName", (req, res) => {
	const customListName = req.params.customListName;
	List.findOne({name: customListName}, (err, foundList) => {
		if (!err) {
			if (!foundList) {
				//Create a new list
				const list = new List({
				name: customListName,
				items: defaultItems
			    });
			    list.save();
			    res.redirect("/" + customListName);
			}
			else{
				//Show an existing list
				res.render('list', {listTitle: foundList.name, newListItems: foundList.items});
			}
		}
	});
	
});


app.post("/delete", (req, res) => {
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;
	if (listName === "Today") {
		Item.findByIdAndRemove(checkedItemId, (err) => {
		if (err) {console.log(err);}
		else{console.log("Item successfully checked and deleted"); res.redirect("/");}
	  });
	} 
	else{
		List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
			if(!err){
				res.redirect("/" + listName);
			}
		})
	}
	
})

app.post("/", (req, res) => {
	const itemName = req.body.newItem;
	const listName = req.body.list;
	const item = new Item({
              name: itemName
       });

	if(listName === "Today"){
       item.save();
       res.redirect("/");
	}
	else{
		List.findOne({name: listName}, (err, foundList) => {
			foundList.items.push(item);
			foundList.save();
			res.redirect("/" + listName);
		});
       
	}
	
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () =>{
    console.log("Server is running on port 3000");
});