
// Clase base para todos los campos
export class Field {
    name: string;
    label: string;

    constructor(name: string, label: string) {
        this.name = name;
        this.label = label;
    }
}

// Clase para inputs
export class InputField extends Field {
    type: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;

    constructor(
        type: string,
        name: string,
        label: string,
        placeholder?: string,
        defaultValue?: string,
        required: boolean = false
    ) {
        super(name, label);
        this.type = type;
        this.placeholder = placeholder;
        this.defaultValue = defaultValue;
        this.required = required;
    }
}

// Clase para selects
export class SelectField extends Field {
    options: { id: string; name: string }[];
    defaultValue?: string;

    constructor(
        name: string,
        label: string,
        options: { id: string; name: string }[],
        defaultValue?: string
    ) {
        super(name, label);
        this.options = options;
        this.defaultValue = defaultValue;
    }
}

// Clase para ComboBox (Extiende Field)
export class ComboboxField extends Field {
  data: { value: string; name: string }[];

  constructor(name: string, label: string, data: { value: string; name: string }[]) {
    super(name, label);
    this.data = data;
  }
}

// Clase para text areas
export class TextAreaField extends Field {
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;

    constructor(
        name: string,
        label: string,
        placeholder?: string,
        defaultValue?: string,
        required: boolean = false
    ) {
        super(name, label);
        this.placeholder = placeholder;
        this.defaultValue = defaultValue;
        this.required = required;
    }
}