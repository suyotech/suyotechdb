import fs from "fs";
import path from "path";

/**
 * Class representing a Schema for data validation.
 */
export class Schema {
  /**
   * Create a schema.
   * @param {Object} schemaObject - The schema object defining structure of documents.
   */
  constructor(schemaObject) {
    this.#schema = schemaObject;
  }

  #schema = null;

  properties() {
    return Object.keys(Object);
  }

  /**
   * Validate if an object matches the schema.
   * @param {Object} obj - The object to validate.
   * @returns {void} - throw error.
   */
  validate(data) {
    const schema = this.#schema;
    if (!data || !schema) {
      throw new Error("Data and schema are required for validation.");
    }

    for (const key in schema) {
      const {
        type: expectedType,
        required,
        default: defaultValue,
      } = schema[key];
      let value = data[key];

      if (required && (value === undefined || value === null)) {
        if (defaultValue !== undefined) {
          data[key] = defaultValue;
        } else {
          throw new Error(`Required field '${key}' is missing`);
        }
      }

      if (required && expectedType === String && value === "") {
        throw new Error(`Required field '${key}' cannot be empty`);
      } else if (!required && value === "") {
        value = undefined;
      }

      // Type validation
      switch (expectedType) {
        case String:
          if (value !== undefined && typeof value !== "string") {
            throw new Error(`Invalid type at '${key}'. Expected String.`);
          }
          break;
        case Number:
          if (value !== undefined && typeof value !== "number") {
            throw new Error(`Invalid type at '${key}'. Expected Number.`);
          }
          break;
        case Boolean:
          if (value !== undefined && typeof value !== "boolean") {
            throw new Error(`Invalid type at '${key}'. Expected Boolean.`);
          }
          break;
        case Object:
          if (
            value !== undefined &&
            (typeof value !== "object" || Array.isArray(value))
          ) {
            throw new Error(`Invalid type at '${key}'. Expected Object.`);
          }
          break;
        case Array:
          if (value !== undefined && !Array.isArray(value)) {
            throw new Error(`Invalid type at '${key}'. Expected Array.`);
          }
          break;
        case Date:
          if (value !== undefined) {
            value = new Date(value); // Attempt to parse date
            if (isNaN(value.getTime())) {
              throw new Error(`Invalid date format at '${key}'.`);
            }
            data[key] = value; // Set parsed date
          }
          break;
        default:
          throw new Error(`Unsupported type at '${key}'.`);
      }
    }
  }
}

export class Model {
  /**
   * Constructs a new Model instance.
   * @param {string} filename - The name of the file to store data.
   * @param {string} dbpath - The db path to store data.
   * @param {Schema} schema - The Schema object for document validation.
   */
  constructor(name, dbpath, schema) {
    if (!name || !dbpath || !(schema instanceof Schema) || !schema) {
      throw new Error("Invalid schema or collection name");
    }

    this.#filepath = path.join(dbpath, `${name}.json`);
    this.#schema = schema;
    this.#initialize();
  }

  #schema = null;
  #filepath = null;

  /**
   * Initialize the collection: create file if not exists.
   */
  #initialize() {
    if (!fs.existsSync(this.#filepath)) {
      fs.writeFileSync(this.#filepath, JSON.stringify([]), "utf-8");
    }

    const sc = this.#schema;
  }

  /**
   * reading data from file
   */
  #readFile() {
    return JSON.parse(fs.readFileSync(this.#filepath, "utf-8"));
  }

  #writeFile(data) {
    fs.writeFileSync(this.#filepath, JSON.stringify(data), "utf-8");
  }

  /**
   * Creates a new document in the model.
   * @param {Object} obj - The object representing the document to be created.
   * @returns {Object} The created document object.
   * @throws {Error} If validation fails or there is an error during file write.
   */
  createOne(obj) {
    try {
      this.#schema.validate(obj); // Validate object against schema
      const data = this.#readFile();
      obj.id = crypto.randomUUID();
      data.push(obj);
      this.#writeFile(data);
      return obj;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  /**
   * Inserts multiple documents into the model.
   * @param {Array<Object>} objs - An array of objects representing the documents to be inserted.
   * @returns {Array<Object>} The array of inserted document objects.
   * @throws {Error} If validation fails or there is an error during file write.
   */
  insertMany(objs) {
    try {
      objs.forEach((obj) => this.#schema.validate(obj)); // Validate objects against schema
      objs.forEach((obj) => (obj.id = obj.id = crypto.randomUUID()));
      const data = this.#readFile();
      data.push(...objs);
      this.#writeFile(data);
      return objs;
    } catch (error) {
      console.error("Error inserting documents:", error);
      throw error;
    }
  }

  /**
   * Finds documents in the model matching the provided query.
   * @param {Object} query - The query object to filter documents.
   * @returns {Operate} The array of documents matching the query.
   * @throws {Error} If there is an error during file read.
   */
  find(query) {
    try {
      const data = this.#readFile();
      const outputdata = data.filter((entry) =>
        this.#matchesQuery(entry, query)
      );
      return new Operate(outputdata, this.#schema);
    } catch (error) {
      console.error("Error finding documents:", error);
      throw error;
    }
  }

  /**
   * Finds a single document in the model matching the provided query.
   * @param {Object} query - The query object to find a document.
   * @returns {Object|null} The document object matching the query, or null if not found.
   * @throws {Error} If there is an error during file read.
   */
  findOne(query) {
    try {
      const data = this.#readFile();
      return data.find((entry) => this.#matchesQuery(entry, query)) || null;
    } catch (error) {
      console.error("Error finding document:", error);
      throw error;
    }
  }

  /**
   * Finds and deletes a single document in the model matching the provided query.
   * @param {Object} query - The query object to find and delete a document.
   * @returns {Object} The deleted document object.
   * @throws {Error} If the document is not found or there is an error during file read/write.
   */
  findAndDeleteOne(query) {
    try {
      const data = this.#readFile();
      const index = data.findIndex((entry) => this.#matchesQuery(entry, query));
      if (index !== -1) {
        const deletedDocument = data.splice(index, 1)[0];
        this.#writeFile(data);
        return deletedDocument;
      }
      throw new Error("Document not found");
    } catch (error) {
      console.error("Error finding and deleting document:", error);
      throw error;
    }
  }

  /**
   * Finds and updates a single document in the model matching the provided query.
   * @param {Object} query - The query object to find a document.
   * @param {Object} update - The update object containing fields to update.
   * @returns {Object} The updated document object.
   * @throws {Error} If the document is not found or there is an error during file read/write.
   */
  findOneAndUpdate(query, update) {
    try {
      const data = this.#readFile();
      let updatedDocument = null;

      const newData = data.map((entry) => {
        if (this.#matchesQuery(entry, query)) {
          const updatedEntry = { ...entry, ...update };
          updatedDocument = updatedEntry;
          return updatedEntry;
        }
        return entry;
      });

      if (updatedDocument) {
        this.#writeFile(newData);
        return updatedDocument;
      } else {
        throw new Error("Document not found");
      }
    } catch (error) {
      console.error("Error finding and updating document:", error);
      throw error;
    }
  }

  /**
   * Updates multiple documents in the model matching the provided query.
   * @param {Object} query - The query object to filter documents.
   * @param {Object} update - The update object containing fields to update.
   * @returns {Array<Object>} The array of updated document objects.
   * @throws {Error} If there is an error during file read/write.
   */
  updateMany(query, update) {
    try {
      const data = this.#readFile();
      const updatedData = data.map((entry) => {
        if (this.#matchesQuery(entry, query)) {
          return { ...entry, ...update };
        }
        return entry;
      });

      this.#writeFile(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error updating documents:", error);
      throw error;
    }
  }

  /**
   * Deletes multiple documents in the model matching the provided query.
   * @param {Object} query - The query object to filter documents for deletion.
   * @returns {Array<Object>} The array of remaining document objects after deletion.
   * @throws {Error} If there is an error during file read/write.
   */
  deleteMany(query) {
    try {
      const data = this.#readFile();
      const newData = data.filter((entry) => !this.#matchesQuery(entry, query));
      this.#writeFile(newData);
      return newData;
    } catch (error) {
      console.error("Error deleting documents:", error);
      throw error;
    }
  }

  /**
   * Helper method to check if an entry matches the provided query, including query operators.
   * @private
   * @param {Object} entry - The entry object from the data array.
   * @param {Object} query - The query object to match against the entry.
   * @returns {boolean} True if the entry matches the query, false otherwise.
   */
  #matchesQuery(entry, query) {
    for (let key in query) {
      const queryValue = query[key];
      const entryValue = entry[key];

      if (typeof queryValue === "object" && queryValue !== null) {
        // Handle query operators ($in, $nin, $lte, $gte, $eq, $ne)
        for (let operator in queryValue) {
          switch (operator) {
            case "$in":
              if (!queryValue.$in.includes(entryValue)) {
                return false;
              }
              break;
            case "$nin":
              if (queryValue.$nin.includes(entryValue)) {
                return false;
              }
              break;
            case "$lte":
              if (entryValue > queryValue.$lte) {
                return false;
              }
              break;
            case "$gte":
              if (entryValue < queryValue.$gte) {
                return false;
              }
              break;
            case "$eq":
              if (entryValue !== queryValue.$eq) {
                return false;
              }
              break;
            case "$ne":
              if (entryValue === queryValue.$ne) {
                return false;
              }
              break;
            default:
              // Unsupported operator
              return false;
          }
        }
      } else {
        // Regular equality check
        if (queryValue !== entryValue) {
          return false;
        }
      }
    }
    return true;
  }
}

/**
 * Operate class for manipulating data based on schema and operations.
 */
class Operate {
  /**
   * Creates an instance of Operate.
   * @param {Array} data - The array of data to operate on.
   * @param {Schema} schema - The schema object defining allowed keys and their types.
   */
  constructor(data, schema) {
    /**
     * @type {Array} data - The array of data to operate on.
     */
    this.data = data;
    /**
     * @type {Schema} schema - The schema object defining allowed keys and their types.
     */
    this.schema = schema;

    this.#check();
  }

  /**
   * Private method to check if data is an array and validate against schema.
   * @private
   */
  #check() {
    if (!Array.isArray(this.data)) {
      throw new Error("Invalid data for operation");
    }

    // Validate each object in data against the schema
    this.data.forEach((obj) => this.validateObject(obj));
  }

  /**
   * Validates an object against the schema.
   * Throws an error if the object does not match the schema.
   * @param {Object} obj - The object to validate.
   * @throws {Error} - Throws error if object does not match schema.
   */
  validateObject(obj) {
    for (let key in this.schema) {
      const { type, required, default: defaultValue } = this.schema[key];

      if (required && !obj.hasOwnProperty(key)) {
        throw new Error(`Missing required property "${key}"`);
      }

      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] !== type.name.toLowerCase()) {
          throw new Error(
            `Invalid type for property "${key}". Expected ${type.name}`
          );
        }
      } else if (defaultValue !== undefined) {
        obj[key] = defaultValue;
      }
    }
  }

  /**
   * Sorts the data array based on the provided sort criteria.
   * @param {Object} sortObj - Object defining sorting criteria { field1: 1, field2: -1 }.
   * @returns {Operate} - Returns the instance of Operate for method chaining.
   * @throws {Error} - Throws error if sort key or operator is invalid.
   */
  sort(sortObj) {
    if (this.data.length === 0) {
      return this; // No sorting needed if data is empty
    }
    for (let key in sortObj) {
      // if (!this.schema.hasOwnProperty(key)) {
      //   throw new Error(`Invalid sort key "${key}"`);
      // }

      const sortOperator = sortObj[key];
      if (sortOperator !== 1 && sortOperator !== -1) {
        throw new Error(
          `Invalid sort operator "${sortOperator}" for key "${key}". Use 1 for ascending, -1 for descending.`
        );
      }

      this.data.sort((a, b) => {
        if (sortOperator === 1) {
          return a[key] - b[key];
        } else if (sortOperator === -1) {
          return b[key] - a[key];
        }
        return 0;
      });
    }

    return this;
  }

  /**
   * Limits the number of elements in the data array.
   * @param {number} number - Maximum number of elements to keep.
   * @returns {Operate} - Returns the instance of Operate for method chaining.
   */
  limit(number) {
    this.data = this.data.slice(0, number);
    return this;
  }

  /**
   * Skips a number of elements from the beginning of the data array.
   * @param {number} number - Number of elements to skip.
   * @returns {Operate} - Returns the instance of Operate for method chaining.
   */
  skip(number) {
    this.data = this.data.slice(number);
    return this;
  }

  /**
   * Selects fields from the data array based on the provided selection criteria.
   * @param {Object} selectObj - Object defining fields to include/exclude { field1: 1, field2: 0 }.
   * @returns {Operate} - Returns the instance of Operate for method chaining.
   * @throws {Error} - Throws error if select key is invalid.
   */
  select(selectObj) {
    const keysToShow = Object.keys(selectObj).filter(
      (key) => selectObj[key] === 1
    );
    const keysToHide = Object.keys(selectObj).filter(
      (key) => selectObj[key] === 0
    );

    if (keysToShow.length === 0) {
      // If no keys to show, hide all specified keys or all keys if none specified to show
      this.data = this.data.map((obj) => {
        const newObj = {};
        for (let key in obj) {
          if (!selectObj.hasOwnProperty(key) || selectObj[key] === 1) {
            newObj[key] = obj[key];
          }
        }
        return newObj;
      });
    } else {
      // Show only selected keys
      this.data = this.data.map((obj) => {
        const newObj = {};
        keysToShow.forEach((key) => {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
          }
        });
        return newObj;
      });
    }

    // Hide specified keys with value 0 from all objects
    keysToHide.forEach((key) => {
      this.data.forEach((obj) => {
        delete obj[key];
      });
    });

    return this;
  }

  /**
   * Removes duplicate values from the data array based on a specified key.
   * @param {string} key - The key to check for duplicates.
   * @returns {Operate} - Returns the instance of Operate for method chaining.
   */
  distinct(key) {
    const distinct = new Set();
    this.data.forEach((obj) => {
      const value = obj[key];
      if (value) {
        distinct.add(obj[key]);
      }
    });

    this.data = Array.from(distinct);
    return this;
  }

  count() {
    this.data = this.data.length;
    return this;
  }

  /**
   * Executes the operations and returns the processed data array.
   * @returns {Array} - The processed data array after all operations.
   */
  exec() {
    return this.data;
  }
}
