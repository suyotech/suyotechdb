type ConstructorType = StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor | DateConstructor;
interface SchemaProperty {
    type: ConstructorType;
    required: boolean;
    default: any;
}
type SchemaTypeDefinition = {
    [key: string]: SchemaProperty;
};
declare class Schema {
    private schema;
    constructor(schema: SchemaTypeDefinition);
    validate(data: any): any;
    private validateType;
    private getTypeName;
}
declare class Model {
    #private;
    /**
     * Constructs a new Model instance.
     * @param {string} name - The name of the file to store data.
     * @param {string} dbpath - The db path to store data.
     * @param {Schema} schema - The Schema object for document validation.
     */
    constructor(name: string, dbpath: string, schema: Schema);
    /**
     * Initialize the collection: create file if not exists.
     */
    private initialize;
    /**
     * Creates a new document in the model.
     * @param {SchemaTypeDefinition} obj - The object representing the document to be created.
     * @returns {Object} The created document object.
     * @throws {Error} If validation fails or there is an error during file write.
     */
    createOne(obj: any): any;
    /**
     * Inserts multiple documents into the model.
     * @param {Array<SchemaTypeDefinition>} objs - An array of objects representing the documents to be inserted.
     * @returns {Array<Object>} The array of inserted document objects.
     * @throws {Error} If validation fails or there is an error during file write.
     */
    insertMany(objs: any[]): any[];
    /**
     * Finds documents in the model matching the provided query.
     * @param {Object} query - The query object to filter documents.
     * @returns {Operate} The array of documents matching the query.
     * @throws {Error} If there is an error during file read.
     */
    find(query: any): Operate;
    /**
     * Finds a single document in the model matching the provided query.
     * @param {Object} query - The query object to find a document.
     * @returns {Object|null} The document object matching the query, or null if not found.
     * @throws {Error} If there is an error during file read.
     */
    findOne(query: any): any;
    /**
     * Finds and deletes a single document in the model matching the provided query.
     * @param {Object} query - The query object to find and delete a document.
     * @returns {Object} The deleted document object.
     * @throws {Error} If the document is not found or there is an error during file read/write.
     */
    findAndDeleteOne(query: any): any;
    /**
     * Finds and updates a single document in the model matching the provided query.
     * @param {Object} query - The query object to find a document.
     * @param {Object} update - The update object containing fields to update.
     * @returns {Object} The updated document object.
     * @throws {Error} If the document is not found or there is an error during file read/write.
     */
    findOneAndUpdate(query: any, update: any): any;
    /**
     * Updates multiple documents in the model matching the provided query.
     * @param {Object} query - The query object to filter documents.
     * @param {Object} update - The update object containing fields to update.
     * @returns {Array<Object>} The array of updated document objects.
     * @throws {Error} If there is an error during file read/write.
     */
    updateMany(query: any, update: any): any[];
    /**
     * Deletes multiple documents in the model matching the provided query.
     * @param {Object} query - The query object to filter documents for deletion.
     * @returns {Array<Object>} The array of remaining document objects after deletion.
     * @throws {Error} If there is an error during file read/write.
     */
    deleteMany(query: any): any[];
}
/**
 * Operate class for manipulating data based on schema and operations.
 */
declare class Operate {
    private data;
    private schema;
    /**
     * Creates an instance of Operate.
     * @param {Array} data - The array of data to operate on.
     * @param {Schema} schema - The schema object defining allowed keys and their types.
     */
    constructor(data: any[], schema: Schema);
    /**
     * Sorts the data array based on the provided sort criteria.
     * @param {Object} sortObj - Object defining sorting criteria { field1: 1, field2: -1 }.
     * @returns {Operate} - Returns the instance of Operate for method chaining.
     * @throws {Error} - Throws error if sort key or operator is invalid.
     */
    sort(sortObj: {
        [key: string]: number;
    }): Operate;
    /**
     * Limits the number of elements in the data array.
     * @param {number} number - Maximum number of elements to keep.
     * @returns {Operate} - Returns the instance of Operate for method chaining.
     */
    limit(number: number): Operate;
    /**
     * Skips a number of elements from the beginning of the data array.
     * @param {number} number - Number of elements to skip.
     * @returns {Operate} - Returns the instance of Operate for method chaining.
     */
    skip(number: number): Operate;
    /**
     * Selects fields from the data array based on the provided selection criteria.
     * @param {Object} selectObj - Object defining fields to include/exclude { field1: 1, field2: 0 }.
     * @returns {Operate} - Returns the instance of Operate for method chaining.
     * @throws {Error} - Throws error if select key is invalid.
     */
    select(selectObj: {
        [key: string]: number;
    }): Operate;
    /**
     * Removes duplicate values from the data array based on a specified key.
     * @param {string} key - The key to check for duplicates.
     * @returns {Operate} - Returns the instance of Operate for method chaining.
     */
    distinct(key: string): Operate;
    /**
     * Counts the number of elements in the data array.
     * @returns {Operate} - Returns the instance of Operate for method chaining.
     */
    count(): Operate;
    /**
     * Executes the operations and returns the processed data array.
     * @returns {Array} - The processed data array after all operations.
     */
    exec(): any[];
}

export { Model, Schema };
