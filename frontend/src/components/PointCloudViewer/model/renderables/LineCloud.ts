export abstract class LineCloud {

    public threeObject!: THREE.Group;

    constructor( public name: string, public origins: number[][], public destinations: number[][], public colors: number[][], public timestamps: number[] ){}

}