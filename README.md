# jargvy

Command line args parser.

## Getting Started
Install the module with: `npm install jargvy`

```javascript
// get it
var jargvy = require('jargvy');

/**
  define rules. 
  'id' is command line arg label
  'name' is what you want to call the option
  'default' is the default value
  'type' which can be one of ['number', 'string', 'boolean]
    lets you define a type without specifying a default
*/
var rules = [
  {'id': '-str', 'name': 'str', 'default': '.' },
  {'id': '-num', 'name': 'num', 'default': 5 },
  {'id': '-bool', 'name': 'bool', 'default': true },
];
jargvy.define(rules);

// parse params
var options = jargvy.extract();
// options will be something like {"str": "./dir", "num": 5}
```
## License
Copyright (c) 2014 Mustafa Rizvi  
Licensed under the MIT license.
