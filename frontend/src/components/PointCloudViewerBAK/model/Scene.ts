import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';
// import { VoxelCube } from '../../../types/DataTypes';
// import { VoxelCube } from '../../../types/types';

export class Scene {

    // container ref
    public container!: HTMLElement;

    // scene elements
    public camera!: THREE.PerspectiveCamera;
    public scene!: THREE.Scene;
    public renderer!: THREE.WebGLRenderer;

    // controls
    public  orbitControls!: OrbitControls;

    // sprite. TODO: more descriptive name
    public sprite: any;

    constructor(){}

    public init( containerRef: HTMLElement, cameraPosition: number[], near: number = 0.1, far: number = 10  ): void {

        // saving container ref
        this.container = containerRef;
        const [containerWidth, containerHeight] = [this.container.offsetWidth, this.container.offsetHeight];

        // initializing camera
        this.initialize_camera( containerWidth, containerHeight, cameraPosition );

        // initializing scene
        this.initialize_scene();

        // initialize renderer
        this.initialize_renderer( containerWidth, containerHeight );

        // initializing controls
        this.initialize_orbit_controls();

        // initializing gaze sprite
        this.initialize_sprite();

    }

    public initialize_sprite(): void {

        // loading texture
        // sprite. TODO: add dynamic path.
        const sprite = new THREE.TextureLoader().load( './sprites/circle.png' );
        this.sprite = sprite;

    }

    // public add_voxel_grid( cellCubes: VoxelCube[], color: string = 'gray', opacity: number = 0.1 ): THREE.Group {

    //     // creating group of highlighted objects
    //     const group: THREE.Group = new THREE.Group();
        
    //     cellCubes.forEach( (cube: VoxelCube) => {

    //         const geometry = new THREE.BoxGeometry( cube.width - 0.01, cube.height - 0.01, cube.depth - 0.01 );
    //         const material = new THREE.MeshBasicMaterial({ color: color, opacity: opacity, transparent: true });
    //         const object = new THREE.Mesh( geometry, material );

    //         // positioning cube
    //         object.position.x = cube.center[0];  
    //         object.position.y = cube.center[1];
    //         object.position.z = cube.center[2];

           

    //         // adding cube to group
    //         group.add( object );

    //     })

    //     // adding cube
    //     this.scene.add( group );

    //     return group;

    // }


    // public clear_objects( renderedObjects: THREE.Object3D[] ): void {

    //     renderedObjects.forEach( object => {
    //         this.scene.remove()
    //     })

    // }

    public clear_scene(): void {

        while (this.scene.children.length){
            this.scene.remove(this.scene.children[0]);
        }  
    }

    // Positions are the gaze origin while normals are the gaze direction
    // We are calculating all the voxels intersected by the user sight of view
    public get_intersected_voxels_centerpoint( positions: number[], normals: number[] ): any {

        for(let i = 0; i < 1; i=i+3){
            
            const origin: THREE.Vector3 = new THREE.Vector3( positions[i], positions[i+1], positions[i+2] );
            const normal: THREE.Vector3 = new THREE.Vector3( normals[i], normals[i+1], normals[i+2] );
            
            const raycaster = new THREE.Raycaster();
            raycaster.set( origin, normal.normalize() );

            // getting intersected objects
            let intersects = raycaster.intersectObjects( this.scene.children );
            intersects = intersects.filter( element => element.object.type === 'Mesh' );
            
            const points: any = intersects.map( (object: any) =>  
                [
                    object.object.position.x,
                    object.object.position.y,
                    object.object.position.z
                ]
            );
            return points;
            
        }
    }

    public add_gaze_point_cloud( positions: number[], normals: number[] ): [THREE.Points, THREE.Line] {

        const pointgeometry = new THREE.BufferGeometry();
        pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        pointgeometry.computeBoundingSphere();

        const pointmaterial = new THREE.PointsMaterial( { size: 0.05 } );
        const points = new THREE.Points( pointgeometry, pointmaterial );
        pointmaterial.color.setHSL( 1.0, 0.3, 0.7 );


        const material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });

        // adding lines
        // for(let i = 0; i < positions.length; i=i+3){
        let line!: THREE.Line;
        for(let i = 0; i < 1; i=i+3){
            
            const origin: THREE.Vector3 = new THREE.Vector3( positions[i], positions[i+1], positions[i+2] );
            const normal: THREE.Vector3 = new THREE.Vector3( normals[i], normals[i+1], normals[i+2] );
            const destination: THREE.Vector3 = origin.clone().add( normal );

            const geometry = new THREE.BufferGeometry().setFromPoints( [origin, destination] );
            line = new THREE.Line( geometry, material );
            this.scene.add( line );

        }

        // adding objects to scene
        this.scene.add( points );

        // returning added points
        return [points, line]
        
    }

    public add_world_point_cloud( positions: number[], colors: number[] = [], normals: number[] = []  ): THREE.Points {

        // loading positions
        const pointgeometry = new THREE.BufferGeometry();
        pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        pointgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        pointgeometry.computeBoundingSphere();

        // defining material
        const pointmaterial = new THREE.PointsMaterial( { size: 0.01, vertexColors: true } );
        const points = new THREE.Points( pointgeometry, pointmaterial );

        // adding to scene
        this.scene.add( points );

        // returning points
        return points;

    }


    public render() {

        requestAnimationFrame( () => this.render() );
        
        this.orbitControls.update();

        this.renderer.render( this.scene, this.camera );

    }

    private initialize_orbit_controls(): void {

        const controls: OrbitControls = new OrbitControls( this.camera, this.renderer.domElement );
        this.orbitControls = controls;

    }


    private initialize_scene(): void {

        const scene: THREE.Scene = new THREE.Scene();
        scene.background = new THREE.Color( 'white' );
        scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

        // saving scene ref
        this.scene = scene;

    }

    private initialize_camera( width: number, height: number, position: number[], near: number = 0.1, far: number = 100 ): void {

        // calculating camera params
        const aspectRatio: number = width/height;
        
        const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera( 75, aspectRatio, near, far );
        
        // camera position grows towards outside the screen
        camera.position.set( position[0], position[1], position[2] );

        // saving ref
        this.camera = camera;

    }

    private initialize_renderer( width: number, height: number ): void {

        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( width - 10, height - 10 );

        // appending renderer
        this.container.appendChild( renderer.domElement );

        // saving ref
        this.renderer = renderer;

    }

}
