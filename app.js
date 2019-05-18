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
        logData: function(){
            return data;
        }
    }
})();

// UI Controller
const UICtrl = (function() {

    // Public methods:
    return {

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
            console.log('Initializing App....');
        }
    }
    
})(ItemCtrl, UICtrl);

// Initialize App
App.init();