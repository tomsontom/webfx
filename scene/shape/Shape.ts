namespace scene.shape {
    export interface NGShape extends NGNode {
        
    }
    export abstract class Shape extends Node {
        elements : PathElement[];
    }
}