export function _camelCase(key: string): string {
    return key?.length > 0 ? key[0].toLowerCase() + key.slice(1) : key;
}

export function _toSentenceCase(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const DEFAULT_PAGESIZE = 10;

export const RegExGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export function _camelToSentenceCase(text: string): string {
    let sResultant = '',
        cLastChar = '';

    for (let iI = 0, iLimit = text.length; iI < iLimit; iI++) {
        if (iI === 0) {
            sResultant += text[iI];
            continue;
        }
        const cChar = text.charAt(iI);
        if (/[A-Z]/.test(cChar)) { // Uppercase letter
            if (/[a-z]/.test(cLastChar)) {
                sResultant += ' ';
                sResultant += cChar.toLowerCase();
                cLastChar = cChar;
                continue;
            }
        }
        sResultant += cChar;
        cLastChar = cChar;
    }
    return sResultant;
}
