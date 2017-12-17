export class ElementUtils {
    static clear( element : Element ) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        return element;
    }
}