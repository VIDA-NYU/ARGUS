// third-party
import * as THREE from 'three';
import { Scene } from '../Scene';
import { WorldVoxelGrid } from '../voxel/WorldVoxelGrid';
import { GazeHeatmap } from './GazeHeatmap';

// model
import { GazeProjection } from './GazeProjection';

export class GazePointCloud {
    
    // projection of the gaze point into world point cloud
    public gazeWorldProjection!: GazeProjection;
    public gazeHeatmap!: GazeHeatmap;

    constructor( public points: number[][], public normals: number[][], public timestamps: number[] ){}

    // returns positions and normals
    public get_buffer_positions( start: number = -1, end: number = -1 ): [number[], number[][], number[]]{

        let positions: number[][] = this.points;
        let normals: number[][] = this.normals;
        let timestamps: number[] = this.timestamps;

        if(start !== -1 && end !== -1){
            positions = positions.slice( 0, positions.length );
            normals = normals.slice( 0, positions.length );
            timestamps = timestamps.slice( 0, positions.length );
        }

        return [positions.flat(), normals, timestamps ];
    }

    public generate_gaze_world_projection( scene: Scene ): GazeProjection {

        this.gazeWorldProjection = new GazeProjection( this.points, this.normals, this.timestamps );
        this.gazeWorldProjection.generate_gaze_projection( scene );

        return this.gazeWorldProjection;
    
    }

    public generate_gaze_heatmap( worldVoxelGrid: WorldVoxelGrid, scene: THREE.Scene ): void {

        this.gazeHeatmap = new GazeHeatmap( worldVoxelGrid );
        this.gazeHeatmap.generate_gaze_heatmap( this.gazeWorldProjection.projectedPoints );
        this.gazeHeatmap.add_to_scene( scene );

    }

    public add_to_scene( scene: THREE.Scene ): THREE.Points {

        // loading positions
        const pointgeometry = new THREE.BufferGeometry();
        pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.points.flat(), 3 ) );
        pointgeometry.computeBoundingSphere();

        // defining material
        const pointmaterial: THREE.PointsMaterial = new THREE.PointsMaterial( { size: 0.015, color: '#377eb8' } );
        const points = new THREE.Points( pointgeometry, pointmaterial );        
        points.userData = { timestamps: this.timestamps, normals: this.normals };

        // adding to scene
        points.name = 'gazepointcloud'
        scene.add( points );

        // returning points
        return points;

    }

    public get_object_by_index( index: number ): { point: number[], normal: number[], timestamp: number} {

        const indexedObject: { point: number[], normal: number[], timestamp: number} = {
            point: this.points[index],
            normal: this.normals[index], 
            timestamp: this.timestamps[index]
        } 

        return indexedObject;

    }

}