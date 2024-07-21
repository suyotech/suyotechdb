var s=class{constructor(e){this.#t=e}#t=null;properties(){return Object.keys(Object)}validate(e){let t=this.#t;if(!e||!t)throw new Error("Data and schema are required for validation.");for(let r in t){let{type:n,required:i,default:o}=t[r],a=e[r];if(i&&a==null)if(o!==void 0)e[r]=o;else throw new Error(`Required field '${r}' is missing`);if(i&&n===String&&a==="")throw new Error(`Required field '${r}' cannot be empty`);switch(!i&&a===""&&(a=void 0),n){case String:if(a!==void 0&&typeof a!="string")throw new Error(`Invalid type at '${r}'. Expected String.`);break;case Number:if(a!==void 0&&typeof a!="number")throw new Error(`Invalid type at '${r}'. Expected Number.`);break;case Boolean:if(a!==void 0&&typeof a!="boolean")throw new Error(`Invalid type at '${r}'. Expected Boolean.`);break;case Object:if(a!==void 0&&(typeof a!="object"||Array.isArray(a)))throw new Error(`Invalid type at '${r}'. Expected Object.`);break;case Array:if(a!==void 0&&!Array.isArray(a))throw new Error(`Invalid type at '${r}'. Expected Array.`);break;case Date:if(a!==void 0){if(a=new Date(a),isNaN(a.getTime()))throw new Error(`Invalid date format at '${r}'.`);e[r]=a}break;default:throw new Error(`Unsupported type at '${r}'.`)}}}},f=s;var d=class{constructor(e,t,r){if(!e||!t||!(r instanceof Schema)||!r)throw new Error("Invalid schema or collection name");this.#i=path.join(t,`${e}.json`),this.#t=r,this.#a()}#t=null;#i=null;#a(){fs.existsSync(this.#i)||fs.writeFileSync(this.#i,JSON.stringify([]),"utf-8");let e=this.#t}#e(){return JSON.parse(fs.readFileSync(this.#i,"utf-8"))}#r(e){fs.writeFileSync(this.#i,JSON.stringify(e),"utf-8")}createOne(e){try{this.#t.validate(e);let t=this.#e();return e.id=crypto.randomUUID(),t.push(e),this.#r(t),e}catch(t){throw console.error("Error creating document:",t),t}}insertMany(e){try{e.forEach(r=>this.#t.validate(r)),e.forEach(r=>r.id=r.id=crypto.randomUUID());let t=this.#e();return t.push(...e),this.#r(t),e}catch(t){throw console.error("Error inserting documents:",t),t}}find(e){try{let r=this.#e().filter(n=>this.#n(n,e));return new c(r,this.#t)}catch(t){throw console.error("Error finding documents:",t),t}}findOne(e){try{return this.#e().find(r=>this.#n(r,e))||null}catch(t){throw console.error("Error finding document:",t),t}}findAndDeleteOne(e){try{let t=this.#e(),r=t.findIndex(n=>this.#n(n,e));if(r!==-1){let n=t.splice(r,1)[0];return this.#r(t),n}throw new Error("Document not found")}catch(t){throw console.error("Error finding and deleting document:",t),t}}findOneAndUpdate(e,t){try{let r=this.#e(),n=null,i=r.map(o=>{if(this.#n(o,e)){let a={...o,...t};return n=a,a}return o});if(n)return this.#r(i),n;throw new Error("Document not found")}catch(r){throw console.error("Error finding and updating document:",r),r}}updateMany(e,t){try{let n=this.#e().map(i=>this.#n(i,e)?{...i,...t}:i);return this.#r(n),n}catch(r){throw console.error("Error updating documents:",r),r}}deleteMany(e){try{let r=this.#e().filter(n=>!this.#n(n,e));return this.#r(r),r}catch(t){throw console.error("Error deleting documents:",t),t}}#n(e,t){for(let r in t){let n=t[r],i=e[r];if(typeof n=="object"&&n!==null)for(let o in n)switch(o){case"$in":if(!n.$in.includes(i))return!1;break;case"$nin":if(n.$nin.includes(i))return!1;break;case"$lte":if(i>n.$lte)return!1;break;case"$gte":if(i<n.$gte)return!1;break;case"$eq":if(i!==n.$eq)return!1;break;case"$ne":if(i===n.$ne)return!1;break;default:return!1}else if(n!==i)return!1}return!0}},c=class{constructor(e,t){this.data=e,this.schema=t,console.log("schema value",this.schema),this.#t()}#t(){if(!Array.isArray(this.data))throw new Error("Invalid data for operation");this.data.forEach(e=>this.validateObject(e))}validateObject(e){for(let t in this.schema){let{type:r,required:n,default:i}=this.schema[t];if(n&&!e.hasOwnProperty(t))throw new Error(`Missing required property "${t}"`);if(e.hasOwnProperty(t)){if(typeof e[t]!==r.name.toLowerCase())throw new Error(`Invalid type for property "${t}". Expected ${r.name}`)}else i!==void 0&&(e[t]=i)}}sort(e){if(this.data.length===0)return this;for(let t in e){let r=e[t];if(r!==1&&r!==-1)throw new Error(`Invalid sort operator "${r}" for key "${t}". Use 1 for ascending, -1 for descending.`);this.data.sort((n,i)=>r===1?n[t]-i[t]:r===-1?i[t]-n[t]:0)}return this}limit(e){return this.data=this.data.slice(0,e),this}skip(e){return this.data=this.data.slice(e),this}select(e){let t=Object.keys(e).filter(n=>e[n]===1),r=Object.keys(e).filter(n=>e[n]===0);return t.length===0?this.data=this.data.map(n=>{let i={};for(let o in n)(!e.hasOwnProperty(o)||e[o]===1)&&(i[o]=n[o]);return i}):this.data=this.data.map(n=>{let i={};return t.forEach(o=>{n.hasOwnProperty(o)&&(i[o]=n[o])}),i}),r.forEach(n=>{this.data.forEach(i=>{delete i[n]})}),this}distinct(e){let t=new Set;return this.data.forEach(r=>{r[e]&&t.add(r[e])}),this.data=Array.from(t),this}count(){return this.data=this.data.length,this}exec(){return this.data}},u=d;export{u as Model,f as Schema};
//# sourceMappingURL=index.js.map
