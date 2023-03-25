export abstract class LineCloud {

    public threeObject!: THREE.Group;

    constructor( public name: string, public origins: number[][], public destinations: number[][], public colors: number[][], public timestamps: number[] ){}

    public filter_lines_by_timestamp( timestamps: number[] ){

        for( let i = 0; ( i < this.timestamps.length); i++ ){

            if( this.timestamps[i] > timestamps[0] && this.timestamps[i] < timestamps[1] ){
                this.threeObject.children[i].visible = true;
            }else{
                this.threeObject.children[i].visible = false;
            }
        }
    }
}