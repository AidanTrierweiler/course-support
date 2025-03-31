import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv); // Add support for formats like "date-time"

// Utility function to validate JSON data
export const validateJson = (data, schema) => {
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
        console.error("Validation errors:", validate.errors);
    }

    return valid;
};