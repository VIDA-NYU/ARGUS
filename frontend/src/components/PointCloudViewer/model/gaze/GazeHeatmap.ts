// model
import { VoxelCube } from "../../types/types";
import { VoxelCell } from "../voxel/VoxelCell";
import { WorldVoxelGrid } from "../voxel/WorldVoxelGrid";

// third-party
import * as THREE from 'three';
import * as d3 from 'd3';


export class GazeHeatmap {

    public voxelCubes: VoxelCube[] = [];
    public counts: number[] = [];

    constructor( public worldVoxelGrid: WorldVoxelGrid ){}

    public generate_color_scale(): d3.ScaleLinear<string, number> {    

        console.log(d3.extent(this.counts));

        const colorScale: any = d3.scaleSequential()
            .domain(d3.extent(this.counts))
            // .range(['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59', '#ef6548','#d7301f','#b30000','#7f0000']);
            .interpolator(d3.interpolateReds);
            
        return colorScale;

    }


    public add_to_scene( scene: THREE.Scene ): void {

        // creating group of highlighted objects
        const group: THREE.Group = new THREE.Group();
        group.name = 'gazeheatmap';

        // color scale
        const colorScale: d3.ScaleLinear<string, number> = this.generate_color_scale();

        const geometry = new THREE.BoxGeometry( this.voxelCubes[0].width - 0.01, this.voxelCubes[0].height - 0.01, this.voxelCubes[0].depth - 0.01 );

        this.voxelCubes.forEach( (cube: VoxelCube, index: number ) => {

            const currentColor: string = d3.color(colorScale(this.counts[index]).toString()).formatHex() 

            // const material = new THREE.MeshBasicMaterial({ color: 'red', opacity: 0.5, transparent: true });
            const material = new THREE.MeshBasicMaterial({ color: currentColor, opacity: 0.5, transparent: true });
            const object = new THREE.Mesh( geometry, material );

            // positioning cube
            object.position.x = cube.center[0];  
            object.position.y = cube.center[1];
            object.position.z = cube.center[2];

            // adding cube to group
            group.add( object );

        })

        // adding cube
        scene.add( group );

    }

    public generate_gaze_heatmap( gazePoints: number[][] ): void {

        // populating grid
        gazePoints.forEach( (point: number[], index: number) => {

            // calculating indices
            const xIndex: number = Math.floor( (point[0] - this.worldVoxelGrid.xExtent[0])/this.worldVoxelGrid.get_cell_size() );
            const yIndex: number = Math.floor( (point[1] - this.worldVoxelGrid.yExtent[0])/this.worldVoxelGrid.get_cell_size() );
            const zIndex: number = Math.floor( (point[2] - this.worldVoxelGrid.zExtent[0])/this.worldVoxelGrid.get_cell_size() );
            
            // adding point to voxel grid
            const currentVoxelCell: VoxelCell = this.worldVoxelGrid.voxelGrid[xIndex][yIndex][zIndex];
            if( !('gazePoint' in currentVoxelCell.counters) ){
                currentVoxelCell.counters['gazePoint'] = 0;
            }
            currentVoxelCell.counters['gazePoint']++;
        });


        const [cubes, counts] = this.worldVoxelGrid.get_voxel_cubes('gazePoint');
        
        console.log('counts: ', counts);
        
        this.voxelCubes = cubes;
        this.counts = counts;

    }

}