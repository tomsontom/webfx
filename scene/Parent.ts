import { NGNode, Node } from "./Node";

export interface NGParent extends NGNode {
    
}

export abstract class Parent extends Node {
    constructor() {
        super();
        console.log("Parent");
    }
}