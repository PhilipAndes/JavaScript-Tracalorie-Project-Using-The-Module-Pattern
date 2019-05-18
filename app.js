// Storage Controller

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
        items: [
            {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Eggs', calories: 300}
        ],
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
    const UISelectors = {
        itemList: '#item-list'
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
        }
    }  
})();



// App Controller 
const App = (function(ItemCtrl, UICtrl) {
    // Public methods:
    // We want the app controller to return just one function or one method and that is going to be the init. (the initializer for the app)
    // Everything we need to run right away when the application loads thats gonna go
    // For example we want the edit stage to be clear on load etc
    // Another important thing init is going to do, is going to call from the item controller, a method get items. (which is going to get all these item from the data), then we use the UI controller to populate the list
    // So as you can see, all these modules are going to work very close together
    return {
        init: function(){
            // Fetch items from data structure
            // We want the getItem when the application initializes so we have to call it here:
            // We are going to put the result of that in a variable:
            const items = ItemCtrl.getItems();
            // Remember the UI controller is going to take care of anything what is taking place on the UI, and populating the list on the UI with our items
            // So what we want to do now is take the items we get from the item controller:
            // Populate list with items:
            // So we gonna have  a UI function or method, and we going to pass in the items we fetch above
            UICtrl.populateItemList(items);
        }
    }
    
})(ItemCtrl, UICtrl);

// Initialize App
App.init();