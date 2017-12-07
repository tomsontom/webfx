/// <reference path="./Node.ts" />

namespace scene {
    export interface NGParent extends NGNode {
        
    }

    export abstract class Parent extends Node {
        constructor() {
            super();
            console.log("Parent");
        }
    }
}