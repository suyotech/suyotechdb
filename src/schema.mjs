/**
 * Class representing a Schema for data validation.
 */
class Schema {
    /**
     * Create a schema.
     * @param {Object} schemaObject - The schema object defining structure of documents.
     */
    constructor(schemaObject) {
      this.#schema = schemaObject;
      
    }
  
    #schema = null;
  
    properties(){
      return Object.keys(Object)
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

  export default Schema