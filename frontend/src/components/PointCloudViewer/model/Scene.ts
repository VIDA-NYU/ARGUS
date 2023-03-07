import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TimestampManager from '../../../tabs/HistoricalDataView/services/TimestampManager';

import { Raycaster } from './Raycaster';
import { Tooltip } from './Tooltip';

export class Scene {

    // container ref
    public container!: HTMLElement;

    // scene elements
    public camera!: THREE.PerspectiveCamera;
    public scene!: THREE.Scene;
    public renderer!: THREE.WebGLRenderer;

    // controls
    public orbitControls!: OrbitControls;
    public rayCaster!: Raycaster;
    public tooltip!: Tooltip;

    constructor(){}

    public init( containerRef: HTMLElement, tooltipContainerRef: HTMLElement, cameraPosition: number[], near: number = 0.1, far: number = 10  ): void {

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
        this.initialize_raycaster();

        // creating tooltip
        this.initialize_tooltip( tooltipContainerRef );

    }

    public clear_scene(): void {

        while (this.scene.children.length){
            this.scene.remove(this.scene.children[0]);
        }  
    }

    public render() {

        requestAnimationFrame( () => this.render() );
        
        // orbit controls
        this.orbitControls.update();

        // picking
        const intersect: {mousePosition: {top: number, left: number}, intersectPosition: THREE.Vector3, timestamp: number, gaze: { origin: THREE.Vector3, direction: THREE.Vector3 } } = this.rayCaster.get_intersected_point( this.camera );
        
        // positioning tooltip
        this.tooltip.position_tooltip(intersect.mousePosition.top, intersect.mousePosition.left);
        if (intersect.mousePosition.top !== 0) this.tooltip.set_video_timestamp(TimestampManager.get_elapsed_time(intersect.timestamp));


        // rendering
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
        renderer.setSize( width, height );

        // appending renderer
        this.container.appendChild( renderer.domElement );

        // saving ref
        this.renderer = renderer;

    }

    private initialize_tooltip( tooltipContainer: HTMLElement ): void {
        this.tooltip = new Tooltip( tooltipContainer )
    }

    public add_point_cloud( name: string, positions: number[], colors: number[] = [], normals: number[][] = [], timestamps: number[] = []  ): THREE.Points {

        // loading positions
        const pointgeometry = new THREE.BufferGeometry();
        pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

        if(colors.length > 0) pointgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        // if(normals.length > 0) pointgeometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        // if(timestamps.length > 0) pointgeometry.setAttribute( 'timestamp', new THREE.Int32BufferAttribute( timestamps, 1 ) );

        pointgeometry.computeBoundingSphere();

        // defining material
        let pointmaterial: THREE.PointsMaterial = new THREE.PointsMaterial( { size: 0.015, color: 'red' } );
        if(colors.length > 0) pointmaterial = new THREE.PointsMaterial( { size: 0.015, vertexColors: true } );
        const points = new THREE.Points( pointgeometry, pointmaterial );
        points.userData = { timestamps, normals };

        // adding to scene
        points.name = name
        this.scene.add( points );

        // returning points
        return points;

    }

    private initialize_raycaster() {

        this.rayCaster = new Raycaster( this.scene );
        this.rayCaster.set_scene_events( this.container );
        
    }

}
