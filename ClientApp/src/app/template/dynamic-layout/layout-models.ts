export interface FormField {
    [key: string]: FormFieldAttributes[];
}

export interface FormFieldAttributes {
    fieldName: string;
    label: string;
    dataType: string;
    required?: boolean;
    length?: number;
    scale?: number;
}

export interface Option {
    text: string;
    value: string;
}