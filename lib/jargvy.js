/*
 * jargvy
 * https://github.com/mustafa/jargvy
 *
 * Copyright (c) 2014 Mustafa Rizvi
 * Licensed under the MIT license.
 */

'use strict';

var optionValueTypes = ['number', 'string', 'boolean'];
var rules = {};

function isOptionStart(val) {
  return val.charAt(0) == '-';
}

function isTrueFlagOptionStart(val) {
  return val.charAt(0) == '-' &&
    val.charAt(1) == '-';
}

function isOptionSet(options, optionName) {
  return options[optionName] !== undefined;
}

function isValidValueType(val) {
  for(var i=0; i<optionValueTypes.length; i++) {
    if(optionValueTypes[i] === val) {
      return true;
    }
  } 
  return false;
}

function getOptionValue(args, valIndex, optionName) {
  if (valIndex >= args.length ||
      isOptionStart(args[valIndex])){
    if (!rules[optionName]) {
      console.log(
        "INFO: Cannot parse unknown option " + optionName +
        ". Ignoring.");
      return undefined;
    }
    console.log("WARN: Malformed Arguments. Option: " + optionName);
    var defaultVal = rules[optionName].defaultVal;
    if (defaultVal !== undefined) {
      console.log("Using default value " + defaultVal);
      return defaultVal;
    } else {
      return undefined;
    }
  }
  return args[valIndex];
}

function getArgv(argv) {
  if (argv === undefined) {
    return process.argv.splice(2);
  } else {
    return argv.splice(2);
  }
}

function setupOptionRules(optionRules) {
  // clear rules
  rules = {};

  for(var i=0; i<optionRules.length; i++) {
    var optionRule = optionRules[i];

    var key = optionRule['id'];
    if(!key) {
      console.log("WARN: Id not set. Ignoring " + optionRule);
      continue;
    }

    // "true flag" type
    if (isTrueFlagOptionStart(optionRule['id'])) {
      valueType = 'boolean';
      valueDefault = false;
    }

    // other types
    else {
      var valueDefault = optionRule['default'];
      var valueType = optionRule['type'];
      if(valueDefault !== undefined) {
        if(typeof valueDefault != valueType && valueType !== undefined) {
          console.log(
              "WARN: Default Value Type and provided Type are not same" +
              ". Using default value's type from: " +
              JSON.stringify(optionRule));
        }
        valueType = typeof valueDefault;
      } else if (valueType !== null) {
        if (!isValidValueType(valueType)) {
          console.log(
            "WARN: Unrecognized value type. Ignoring: " +
            JSON.stringify(optionRule));
          continue;
        }
      }
    }

    rules[key] = {
      'name': optionRule['name'],
      'default': valueDefault,
      'type': valueType
    };
  }
}

function getOptions(argsInput) {
  var args = getArgv(argsInput);

  var options = {};
  if(args.length == 0) {
    console.log("Nothing to do. Try 'jgrep --help'");
    return {};
  }

  // read the query term
  options.query = args[0];
  args = args.slice(1);

  for (var i=0; i<args.length; i++) {
    if (!isOptionStart(args[i])) {
      continue;
    }
    var key = args[i];
    var rule = undefined;
    if (rules[key] !== undefined) {
      rule = rules[key];
    }
    if (!rule) {
      console.log(
          "WARN: Ignoring option type " + key);
      continue;
    }

    var optionVal;
    if (isTrueFlagOptionStart(key)) {
      optionVal = true;
    } else {
      optionVal = getOptionValue(args, i+1, key);
    }
    if (optionVal !== undefined) {
      options[rule.name] = optionVal;
    }
  }

  // fill in defaults
  for(var key in rules) {
    var appOption = rules[key];
    if (!isOptionSet(options, appOption.name)) {
      options[key] = appOption.defaultVal;
    }
  }
        
  return options;
}

function getOptionRules() {
  return rules;
}

// exports
exports.define = setupOptionRules;
exports.peek = getOptionRules;
exports.extract = getOptions;
