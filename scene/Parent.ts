import { NGNode, Node } from "./Node";

export interface NGParent extends NGNode {
    
}

export abstract class Parent extends Node {
    static readonly         DIRTY_CHILDREN_THRESHOLD    : number = 10;
    private static readonly REMVOVED_CHILDREN_THRESHOLD : number = 20;


    constructor() {
        super();
        console.log("Parent");
    }
}