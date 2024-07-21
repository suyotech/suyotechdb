# File-based JSON Database Inspired by Mongoose ODM

This repository provides a lightweight, file-based JSON database system inspired by Mongoose ODM. It allows you to model, store, and retrieve data using a schema-based approach similar to Mongoose, but all data is stored in local JSON files.

## Features

- Schema-based data modeling
- Simple CRUD operations
- Validation and default values
- File-based storage for easy setup and portability

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

const User =  new Model('users',databse_path, userSchema);

export default User;
```



