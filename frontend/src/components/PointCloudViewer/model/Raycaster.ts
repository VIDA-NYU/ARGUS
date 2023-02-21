import * as THREE from 'three';
import { Scene } from 'three';

export class Raycaster {

    private rayCaster!: THREE.Raycaster;

    // Mouse pointer
    public pointer: THREE.Vector2 = new THREE.Vector2();

    // ray intersection highlight
    public sphere!: THREE.Mesh;


    constructor( public scene: Scene ){

        // initializing ray caster
        this.rayCaster = new THREE.Raycaster();
        this.rayCaster.params.Points.threshold = 0.01;

        // creating highlight sphere
        const sphereGeometry = new THREE.SphereGeometry( 0.025, 15, 15 );
        const sphereMaterial = new THREE.MeshBasicMaterial( { color: 'blue' } );
        this.sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

        // adding highlight to scene
        this.scene.add( this.sphere );

    }

    public get_intersected_point( camera: THREE.PerspectiveCamera ): {mousePosition: THREE.Vector2, intersectPosition: THREE.Vector3 } {

        // update the picking ray with the camera and pointer position
        this.rayCaster.setFromCamera( this.pointer, camera );

        // getting scene objects
        const sceneObject = this.scene.getObjectByName('gazepointcloud');
        const intersects = sceneObject ? this.rayCaster.intersectObjects( [sceneObject], false ) : [];
        if(intersects && intersects.length > 0){

            // plotting highlight sphere
            this.sphere.position.copy(intersects[0].point);
            this.sphere.scale.set(1,1,1);
            
            // returning positions
            return {mousePosition: this.pointer, intersectPosition: intersects[0].point}
        
        } else {

            // hiding the sphere
            this.sphere.scale.set(0,0,0);

            // returning positions
            return {mousePosition: new THREE.Vector2(0,0), intersectPosition: new THREE.Vector3(0,0,0)}
        }
    }

    public on_pointer_move( event, canvasContainer: HTMLElement ): void {

        // d3.select(this.tooltipContainer)
        //     .style('top', `${event.clientY}px`)
        //     .style('left', `${event.clientX}px`)
        
        // Ref: https://discourse.threejs.org/t/custom-canvas-size-with-orbitcontrols-and-raycaster/18742
        const rect = canvasContainer.getBoundingClientRect();
        this.pointer.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        this.pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    }

    public set_scene_events( canvasContainer: HTMLElement ): void {
        canvasContainer.addEventListener('pointermove', (event) => {this.on_pointer_move( event, canvasContainer)})
    }
    

}