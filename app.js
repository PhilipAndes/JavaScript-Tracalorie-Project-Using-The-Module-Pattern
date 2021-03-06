// Storage Controller
// We set this to an iify
const StorageCtrl = (function(){
    // Public methods:
    return {
        storeItem: function(item){
            let items;
            // Check if any items in local storage:
            if(localStorage.getItem('items') === null){
                // if not then set it an empty array
                items = [];
                // Push new item:
                items.push(item);
                // Set local storage:
                // As local storage holds strings we have to wrap it in json.stringify to get it as object
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // If there are items in local storage we need to get those items:
                // And remember because it is a string in local storage we gonna need to parse it with json
                items = JSON.parse(localStorage.getItem('items'));

                // Push the new item
                items.push(item);

                // Reset local storage:
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        // Get items from local storage
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                // If there is nothing there items will be set to nothing
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            // Loop through items:
            // We also pass in the index, so we know the index of the iteration
            items.forEach(function(item, index){
                // If the updated item id is equal to the current item id then we want to splice it out, basicaly remove it:
                // We want to remove 1 from whatever the index is:
                // And then replace it with updated item:
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            // Reset local storage:
            localStorage.setItem('items', JSON.stringify(items));
        },
        // Delete items from local storage (delete button):
        // Same as the function above (updateItemStorage)
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            // Reset local storage:
            localStorage.setItem('items', JSON.stringify(items));        
        },
        // Clear items from local storage (clear button):
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
// We set this to an iify (so an immediate invoked function expression)
// So in orther to invoke we have to put an extra pair of paretheses on the end
const ItemCtrl = (function() {
    // Item Constructor
    // When we add an item in the UI we need a item constructor , so we can create a item and add it to the data structure
    // Everytime we add a item it is going to have a id, name and calories
    const Item = function(id, name, calories){
        // with any constructer we first need to set the property to the property being passed in:
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        // We use an array of objects:
        // Each item will have an ID, name and calories:
        // Commented this out, as this was just for testing:
        // items: [    
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 400},
        //     // {id: 2, name: 'Eggs', calories: 300}
        // ],
        // We set it to a new item:
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null, // When we click the update button in the UI we want the clicked item to be the currentItem, then that is going to be put up in the form to be updated
        totalCalories: 0
    }
 
    // Public methods:
    return {
        // Let create a function getItems:
        getItems: function(){
            // All we doing here is:
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            // We need to generate a ID:
            // if data.items is greater then 0
            if(data.items.length > 0){
                // Then we want the index to be the length minus 1, so if there is 4 we want this to be 3 etc
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Then we want to parse the calories as a number, because it is going to be string now:
            calories = parseInt(calories);

            // Then we want to create a new item
            // Remember we have a constructor in the Item controller so we have to say new Item and pass in the data:
            newItem = new Item(ID, name, calories);

            // Then we want to push the new item to the data structure in the item controller:
            // Add to items array:
            data.items.push(newItem);

            // And then we simply going to return the new item because remember we going to put it in a variable down below!
            return newItem;
        },
        // Get item by id when you click on the edit icon
        getItemById: function(id){
            let found = null;
            // loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        // When we click the update button:
        updateItem: function(name, calories){
            // Calories to number:
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                // Remember when we click the edit icon, its going to be added to the currentitem, so:
                if(item.id === data.currentItem.id){
                    // Then set the item name equal to the name passed in above
                    item.name = name;
                    // Same for the calories
                    item.calories = calories;
                    // Then set found equal to the item itself
                    found = item;
                }
            });
            // And return found:
            return found;
            // Notice that this will change it in the data structure, not in the UI!
        },
        deleteItem: function(id){
            // Get ids with the map method:
            const ids = data.items.map(function(item){
                return item.id;
            });

            // Get index:
            const index = ids.indexOf(id);
            // Splice it out of the array:
            // Remove item, and take 1 from the index
            data.items.splice(index, 1);
        },
        // Clear button:
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        // When we click the edit icon:
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            // So here we need to loop through the items and get the calories
            // let because this is gonna change
            let total = 0;
            // we can access our data and loop through our item array
            data.items.forEach(function(item){
                // total = total + item.calories: 
                total += item.calories;
            });

            // Set total calories in data structure:
            data.totalCalories = total;

            // Return total
            return data.totalCalories;
        },
        logData: function(){
            return data; 
        }
    }
})();



// UI Controller
const UICtrl = (function() {        
    // the #item-list can be changed at any time, and we dont want to go through all our javascript and change it each indivitual one 
    // So what we do, is create a object called UI selectors
    // Any class or id we use inside of a selector we want to put inside here:
    // It makes the code more efficient as wel as more scalable
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li', // all the <li>
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Public methods:
    return {
        populateItemList(items){
            // We want to loop through the items, and make each one into a list item <li> and insert it into the <ul>
            // So lets define a variable to html and set it to nothing:
            let html = '';
            // Then take the items and loop through them:
            // And remember a forEach takes in a callback function:
            // Give it an indentifier (item)
            items.forEach(function(item){
                // Then lets take that html variable from above and append to it:
                // We are going to have a <li> and we it to have a id, which would be item- the actual id of the item so that is going to be a variable:
                // It is also going to have a class
                // So everytime it loops true an <li> will  be added to the html variable above
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories}  Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });
            // So now we want to take all these <li>'s and put them into the <ul> in the application
            // So select the id from the DOM and change it to the variable html from above
            // See the UISelector object above for more info
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        // Get item input 
        
        getItemInput: function(){
            return {
                // we can get it by the id's we gave it in the UI, so we first have to add those at our UISelectors again
                // Return a object with the name and calories
                // since it is an input we have to use .value
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        // Add new item to the UI 
        addListItem: function(item){
            // Show the list with items:
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class:
            li.className = 'collection-item';
            // Add id, this is going to be dynamic:
            li.id = `item-${item.id}`;
            // Add HTML:
            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories}  Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            // Now we just have to insert it:
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // So now we putting this in the listItems variable
            // This will give us a node list, and we need to loop through these nodes, we cannot use a foreach on a node so we have to convert it into an array:
            // Turn Node list into array:
            listItems = Array.from(listItems);
            // So now we can do whatever we want
            listItems.forEach(function(listItem){
                // we set it to a new variable, and use getAttribute because we want to get the id:
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    // If this is true then we know its the one we want to actual update:
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}  Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        // Delete list item:
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        // Clear input fields in the UI:
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        // Add item to form when edit icon is clicked:
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        // Remove items from UI when clear all is clicked:
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        // Hide list if no items:
        // Use this function in the init below!
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        // Show total calories
        showTotalCalories: function(totalCalories){
            // For this we are going to have to select a UI selector
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        // Clear edit state
        clearEditState: function(){
            UICtrl.clearInput();
            // Hide all the buttons except for the add meal button:
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            // THe add button inline
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        // When we click on the edit icon
        showEditState: function(){
            // We want all the buttons to show now except for the add meal button:
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            // THe add button display none
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        // To use UISelectors we first have to make it public:
        getSelectors: function(){
            return UISelectors;
        }
    }  
})();



// App Controller 
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function(){
        // We have to call the loadEventListeners in the init function below!
        // Get UI Selectors:
        const UISelectors = UICtrl.getSelectors();

        // We need an event to add a item:
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            // You can look up the keycodes for each key, enter = 13
            // Some older browsers dont support the key code so we say or || e.which === 13 
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event:
        // We have to use some event delegation as we cannot target the edit item button directly 
        // So we are going to target the list where its in (itemlist)
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState); 

        // Clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    // Add item submit:
    const itemAddSubmit = function(e){
        // Check if there something here:
        // Get form input from UI Controller:
        const input = UICtrl.getItemInput();

        // If either name or calories is not filled, the user can't add anything!
        // Check for name and calorie input:
        // so if name input is not empty AND calories input is not empty we can proceed:
        if(input.name !== '' && input.calories !== ''){
            // Add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories:
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in localStorage:
            StorageCtrl.storeItem(newItem);

            // Clear input fields in UI:
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Item edit click:
    const itemEditClick = function(e){
        // We want to target the edit icon:
        // To do that we target the class of the icon (edit-item)
        if(e.target.classList.contains('edit-item')){
            // Get list item id (item-0, item-1 etc)
            // To do this we need to target the parent of the parent of the icon which is the <li> with the id
            const listId = e.target.parentNode.parentNode.id;

            // Now we just need to get the number of the id (not the item- part), so we gonna need to split it at the dash
            // Break into an array
            const listIdArr = listId.split('-');
            // If you console log this you can see its splitted in a array with item for 0 and the number for 1

            // So lets get the actual id which is [1]
            // parse it as a number
            const id = parseInt(listIdArr[1]);

            // Now we have the id, we want to get the entire object, item:
            const itemToEdit = ItemCtrl.getItemById(id);
            
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form when edit icon is clicked
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // Update item submit:
    const itemUpdateSubmit = function(e){
        // Get item input:
        const input = UICtrl.getItemInput();

        // Update item:
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update the UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories:
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage:
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete button event:
    const itemDeleteSubmit = function(e){
        // get current item id
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories:
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage:
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear items event:
    const clearAllItemsClick = function(){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Get total calories:
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Remove from UI
        UICtrl.removeItems();

        // Clear from local storage (clear button):
        StorageCtrl.clearItemsFromStorage();

        // Hide UL 
        UICtrl.hideList();


    }


    // Public methods:
    // We want the app controller to return just one function or one method and that is going to be the init. (the initializer for the app)
    // Everything we need to run right away when the application loads thats gonna go
    // For example we want the edit stage to be clear on load etc
    // Another important thing init is going to do, is going to call from the item controller, a method get items. (which is going to get all these item from the data), then we use the UI controller to populate the list
    // So as you can see, all these modules are going to work very close together
    return {
        init: function(){
            // Clear edit state / set initial set:
            UICtrl.clearEditState();

            // Fetch items from data structure
            // We want the getItem when the application initializes so we have to call it here:
            // We are going to put the result of that in a variable:
            const items = ItemCtrl.getItems();

            // Now we first want to Check if there are any items, if not then remove the list markup from the UI:
            if(items.length === 0){
                UICtrl.hideList();
            } else {
                // Populate list with items:
                // Remember the UI controller is going to take care of anything what is taking place on the UI, and populating the list on the UI with our items
                // So what we want to do now is take the items we get from the item controller:
                // So we gonna have  a UI function or method, and we going to pass in the items we fetch above
                UICtrl.populateItemList(items);
            }

            // Get total calories:
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners:
            loadEventListeners();
        }
    }
    
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();