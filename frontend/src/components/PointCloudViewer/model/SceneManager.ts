// third party
import * as THREE from 'three';
import { VoxelCube } from '../types/types';

// model 
import { PointCloud } from "./renderables/PointCloud";
import { VoxelCloud } from './renderables/VoxelCloud';


export class SceneManager {

    constructor( public scene: THREE.Scene ){}
    
    public add_point_cloud( pointCloud: PointCloud, materialParams: any = {} ): THREE.Points {

        // getting raw data
        const [points, colors, normals] = pointCloud.get_buffer_positions();

        const sprite = new THREE.TextureLoader().load( '/sprites/disc.png' );

        // loading positions
        const pointgeometry = new THREE.BufferGeometry();
        if(points.length > 0) pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( points, 3 ) );
        if(colors.length > 0) pointgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        if(normals.length > 0) pointgeometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        pointgeometry.computeBoundingBox();

        const pointmaterial = new THREE.PointsMaterial( { size: 0.015, map: sprite, vertexColors: true,sizeAttenuation: true, alphaTest: 0.5, transparent: true } );
        const pointCloudObject = new THREE.Points( pointgeometry, pointmaterial );

        // adding to scene
        pointCloudObject.name = pointCloud.name;
        this.scene.add( pointCloudObject );
        
        return pointCloudObject;
    
    }


    public add_voxel_cloud( voxelCloud: VoxelCloud ): THREE.Group {

        // creating group of highlighted objects
        const group: THREE.Group = new THREE.Group();
        group.name = voxelCloud.name;

        const voxelCubes: VoxelCube[] = voxelCloud.get_voxel_cubes();
        const colors: number[][] = voxelCloud.get_voxel_colors();
        const opacities: number[] = voxelCloud.get_voxel_opacities();

        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry( voxelCubes[0].width, voxelCubes[0].height, voxelCubes[0].depth );
        
        voxelCubes.forEach( (cube: VoxelCube, index: number ) => {
            
            const color: THREE.Color = new THREE.Color( colors[index][0], colors[index][1], colors[index][2]  )
            const material = new THREE.MeshBasicMaterial({ color: color, opacity: opacities[index], transparent: true });
            const object = new THREE.Mesh( geometry, material );

            // positioning cube
            object.position.x = cube.center[0];  
            object.position.y = cube.center[1];
            object.position.z = cube.center[2];

            // adding cube to group
            group.add( object );

        })

        // adding cube
        this.scene.add( group );

        return group;

    }


}