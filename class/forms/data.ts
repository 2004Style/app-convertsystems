import { Field } from "./base";

// Clase para campos de archivo (file)
export class FileField extends Field {
    required?: boolean;

    constructor(name: string, label: string, required: boolean = false) {
        super(name, label);
        this.required = required;
    }
}