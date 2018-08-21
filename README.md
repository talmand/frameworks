## Frameworks Playground

A playground to play with different frameworks that allow for a drop-in solution. The project is just a simple user interface that allows for creating, editing, and deleting information. There is no validation and testing so it is easy to enter unexpected input. The goal is to allow experimenting with the frameworks in various ways and patterns. Some parts will be the "right way" while others will not.

The CSS is standard across all framework examples. The goal is the same UI and UX across all examples.

The HTML is fairly consistent but changed based on the requirements of the framework in use.

The frameworks in use:

Vanilla JS:  
vanilla.js - module pattern but minimum modules, heavy code on main module  
vanills2.js - module pattern with store module, modules handle more functionality

VueJS: drop-in, lightweight  
vue.js - based on minimum components, heavy code on the vm component  
vue2.js - more components that handle more functionality, uses a store pattern

ReactJS: drop-in with babel.js to support Class and JSX, heavy load  
react.js - based on minimum components, heavy code on the app component  
react2.js - more components that handle more functionality, work in progress