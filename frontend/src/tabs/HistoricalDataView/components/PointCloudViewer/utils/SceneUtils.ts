export class SceneUtils {


    public static get_camera_initial_position( extents: number[][] ): number[] {

        const x: number = (extents[0][0] + extents[0][1]) / 2; 
        const y: number = (extents[1][0] + extents[1][1]) / 2; 
        const z: number = extents[2][1] + 2; 

        return [x, y, z];

    }

}