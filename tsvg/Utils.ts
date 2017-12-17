export type Length = number | string;

export class ElementUtils {
    static clear( element : Element ) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        return element;
    }
}

export class LengthUtils {
    static isValid(length: Length, percentage? : boolean) : boolean {
        if( typeof length === "number" ) {
            return true;
        } 
        var v = String(length);
        if( percentage && v.endsWith("%") ) {
            return true;
        }
        return v.endsWith("em")
            || v.endsWith("ex")
            || v.endsWith("px")
            || v.endsWith("in")
            || v.endsWith("cm")
            || v.endsWith("mm")
            || v.endsWith("pt")
            || v.endsWith("pc");
    }
}