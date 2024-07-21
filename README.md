


# suyotechdb - File-based JSON Database Inspired by Mongoose ODM with Zero Dependency

This repository provides a lightweight, file-based JSON database system inspired by Mongoose ODM. It allows you to model, store, and retrieve data using a schema-based approach similar to Mongoose, but all data is stored in local JSON files.

**Developed by**  - [suyotech.com](#https://suyotech.com)

### Table Of Contents
- [suyotechdb - File-based JSON Database Inspired by Mongoose ODM](#suyotechdb---file-based-json-database-inspired-by-mongoose-odm)
      - [Developed by  - suyotech.com](#developed-by----suyotechcom)
    - [Table Of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [CJS](#cjs)
    - [ES6](#es6)
  - [CRUD Operations](#crud-operations)
    - [createOne](#createone)
    - [insertMany](#insertmany)
    - [findOne](#findone)
    - [findAndDeleteOne](#findanddeleteone)
    - [findOneAndUpdate](#findoneandupdate)
    - [udpateMany](#udpatemany)
    - [deleteMany](#deletemany)
  - [find](#find)
## Features

- Zero Dependency
- Schema-based data modeling
- Simple CRUD operations
- Validation and default values
- File-based storage for easy setup and portability
- All functions are syncronous. (Async not supported for easy usage)




## Installation

To install the required dependencies, run:

```bash
npm install suyotechdb
```

## Usage

### CJS

```bash
const { Schema, Model } = require('suyotechdb');

const userSchema = new Schema({
  name: { type: String, required: true,default : "" },
  email: { type: String, required: true, default: "" },
  age: { type: Number, default: 18 },
});

// define database path where to save files
const database_path  = "./db"; 

const User =  new Model('users',database_path, userSchema);

module.exports = User;
```

### ES6

```bash
import { Schema, Model } from 'suyotechdb' ;

const userSchema = new Schema({
  name: { type: String, required: true,default : "" },
  email: { type: String, required: true, default: "" },
  age: { type: Number, default: 18 },
});

//define database path where to save files
const database_path  = "./db"

const userModel =  new Model('users',databse_path, userSchema);

export default User;
```

## CRUD Operations

### createOne
Use the **createOne** function to add a new item
```bash

userModel.createOne({
  name : "suyog",
  email : "test@domain.com",
  age : 20,
})
```

### insertMany
Use the **createOne** function to add a new item
```bash

const users = [
{
  name : "suyog",
  email : "test@domain.com",
  age : 20,
},
{
    name : "user2",
  email : "email@domain.com",
  age : 26,
}
]

userModel.insertMany(users)
```

### findOne
Use the **findOne** function to find one document
```bash
const user = userModel.findOne({name : "suyog"})
console.log(user); // { id: ksldf09-ksdjflsd-sdkfsld, name: 'suyog',email : "suyog@gmail.com",age : 20 } 
```

### findAndDeleteOne
Use the **findAndDeleteOne** to find first matching document and delelte.
```bash
const query = {name : "suyog"}
const result = userModel.findAndDeleteOne(query)
console.log(result) // deleted successfully
```

### findOneAndUpdate
Use the **findOneAndUpdate** to find first matching docuemnt and update.
```bash
const query = {name : "suyog"}
cosnt updateData = {age : 30}
const result = userModel.findAndDeleteOne(query,updateData)
console.log(result) // updated successully
```

### udpateMany
Use the **udpateMany** to find first matching docuemnt and update.
```bash
const query = {name : "suyog"}
cosnt updateData = {age : 30}
const result = userModel.updateMany(query,updateData)
console.log(result) // updated successully
```

### deleteMany
Use the **deleteMany** to find first matching docuemnt and update.
```bash
const query = {name : "suyog"};
const result = userModel.deleteMany(query);
console.log(result) // updated successully
```

## find
This is special query which can use many different chained operations 
- It supports following operation for query operators
   - **$in** - Finds value in field
   - **$nin** - Check not in values
   - **$eq** - Equals to
   - **$ne** - Not equals to
   - **$gte** - Greater Than
   - **$lte** - Less Than
- Chained Functions
  - **sort** - Sort by given query
  - **limit** - Limits Documents
  - **skip** - Skips Documents
  - **select** - Select or deselect based value 0 or 1 respectively
  - **distinct** - Distinct Field Values
  - **count** - Count of find query result
  - **exec** - Function need after find or chained to return data.

```bash
const query  = {age  :{$gte: 10}}
const result = userModel.find(query)

```