// third-party
import * as THREE from 'three';
import { VoxelCube } from '../types/types';

// model
import { VoxelCell } from './voxel/VoxelCell';
import { WorldVoxelGrid } from './voxel/WorldVoxelGrid';

export class WorldPointCloud {

    // world extents
    public xExtent: number[] = [];
    public yExtent: number[] = [];
    public zExtent: number[] = [];

    public voxelGrid!: WorldVoxelGrid;

    constructor( public worldCoords: number[][], public worldColors: number[][] ){

        // calculating world extents
        this.calculate_world_extents( worldCoords );

    }

    public get_buffer_positions(): [number[], number[]] {

        return [this.worldCoords.flat(), this.worldColors.flat()];

    }

    public add_voxels_to_scene( scene: THREE.Scene, cubes: VoxelCube[] ): void {

        // creating group of highlighted objects
        const group: THREE.Group = new THREE.Group();
        
        cubes.forEach( (cube: VoxelCube) => {

            const geometry = new THREE.BoxGeometry( cube.width - 0.01, cube.height - 0.01, cube.depth - 0.01 );
            const material = new THREE.MeshBasicMaterial({ color: 'gray', opacity: 0.1, transparent: true });
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

        // return group;

    }

    public add_to_scene( scene: THREE.Scene, voxelGrid: boolean = true ): void {

        // getting raw data
        const [coords, colors] = this.get_buffer_positions();

        // loading positions
        const pointgeometry = new THREE.BufferGeometry();
        pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( coords, 3 ) );
        pointgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        pointgeometry.computeBoundingBox();

        // defining material
        const pointmaterial = new THREE.PointsMaterial( { size: 0.015, vertexColors: true } );
        const points = new THREE.Points( pointgeometry, pointmaterial );
        // points.userData = { timestamps, normals };

        // adding to scene
        points.name = 'worldpointcloud'
        scene.add( points );

        if( voxelGrid ){
            this.voxelGrid = new WorldVoxelGrid( this.xExtent, this.yExtent, this.zExtent );
            this.voxelGrid.build_voxel_grid( this.worldCoords, this.worldColors); 
        } 
    }

    private calculate_world_extents( points: number[][] ): void {

        const xExtent: number[] = [Infinity, -Infinity];
        const yExtent: number[] = [Infinity, -Infinity];
        const zExtent: number[] = [Infinity, -Infinity];

        points.forEach( (point: number[] ) => {

            xExtent[0] = Math.min(point[0], xExtent[0]);
            xExtent[1] = Math.max(point[0], xExtent[1]);

            yExtent[0] = Math.min(point[1], yExtent[0]);
            yExtent[1] = Math.max(point[1], yExtent[1]);

            zExtent[0] = Math.min(point[2], zExtent[0]);
            zExtent[1] = Math.max(point[2], zExtent[1]);

        });

        this.xExtent = xExtent;
        this.yExtent = yExtent;
        this.zExtent = zExtent;
    }

}