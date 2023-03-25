// third party
import { line } from 'd3';
import * as THREE from 'three';
import { VoxelCube } from '../types/types';
import { LineCloud } from './renderables/LineCloud';

// model 
import { PointCloud } from "./renderables/PointCloud";
import { VoxelCloud } from './renderables/VoxelCloud';


export class SceneManager {

    constructor( public scene: THREE.Scene ){}
    
    public add_point_cloud( pointCloud: PointCloud, materialParams: any = {} ): THREE.Points {

        // getting raw data
        const [points, colors, normals] = pointCloud.get_buffer_positions();

        // const sprite = new THREE.TextureLoader().load( '/sprites/disc.png' );

        // loading buffers
        const pointgeometry = new THREE.BufferGeometry();
        if(points.length > 0) pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( points, 3 ) );
        if(colors.length > 0) pointgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        if(normals.length > 0) pointgeometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        pointgeometry.setAttribute( 'visibility', new THREE.Float32BufferAttribute( pointCloud.visibility, 1 ) );
        pointgeometry.computeBoundingBox();

        const visibilityShader = (shader) => {
            
            shader.vertexShader = `
                attribute float visibility; 
                varying float vVisible; 
                ${shader.vertexShader}`.replace(
                `gl_PointSize = size;`,
                `gl_PointSize = size;
                vVisible = visibility;`
            );

            shader.fragmentShader = `
                varying float vVisible;
                ${shader.fragmentShader}`.replace(
                    `#include <clipping_planes_fragment>`,
                    `if (vVisible < 0.5) discard;
                    #include <clipping_planes_fragment>`
                );

        }

        // alphaTest: 0.5,
        const pointmaterial = new THREE.PointsMaterial( { size: 0.015, vertexColors: true, sizeAttenuation: true, transparent: true } );
        // const pointmaterial = new THREE.PointsMaterial( { size: 0.015, map: sprite, vertexColors: true, alphaTest: 0.5, sizeAttenuation: true, transparent: true } );
        pointmaterial.onBeforeCompile = visibilityShader;
        
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

    public add_line_cloud( lineCloud: LineCloud ): THREE.Group {

        // creating group of highlighted objects
        const group: THREE.Group = new THREE.Group();
        group.name = lineCloud.name;

        for( let i = 0; (i < lineCloud.origins.length) && (i < lineCloud.destinations.length); i++ ){

            const originVector: THREE.Vector3 = new THREE.Vector3( lineCloud.origins[i][0], lineCloud.origins[i][1], lineCloud.origins[i][2] );
            const destinationVector: THREE.Vector3 = new THREE.Vector3( lineCloud.destinations[i][0], lineCloud.destinations[i][1], lineCloud.destinations[i][2] );

            // Direction highlight
            const originColor: THREE.Color = new THREE.Color( lineCloud.colors[i][0], lineCloud.colors[i][1], lineCloud.colors[i][2] );
            const lineMaterial = new THREE.LineBasicMaterial({ color: originColor, linewidth: 2, transparent: true, opacity: 0.5 });
            const lineGeometry = new THREE.BufferGeometry().setFromPoints( [originVector, destinationVector] );
            const line: THREE.Line = new THREE.Line( lineGeometry, lineMaterial );

            group.add(line);
        }

        this.scene.add( group );
        return group;

    } 


}