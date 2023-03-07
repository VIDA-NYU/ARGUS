import * as THREE from 'three';
import { Scene, Vector3 } from 'three';

export class Raycaster {

    private rayCaster!: THREE.Raycaster;
    private worldRaycaster!: THREE.Raycaster;

    // Mouse pointer
    public pointer: THREE.Vector2 = new THREE.Vector2();
    public pointerEvent!: MouseEvent;

    // ray intersection highlight
    public gazeIntersectSphere!: THREE.Mesh;
    public worldIntersectSphere!: THREE.Mesh;
    public gazeLine!: THREE.Line;

    constructor( public scene: Scene ){

        // initializing ray caster
        this.rayCaster = new THREE.Raycaster();
        this.rayCaster.params.Points.threshold = 0.01;

        // initializing world ray caster
        this.worldRaycaster = new THREE.Raycaster();
        this.worldRaycaster.params.Points.threshold = 0.01;

        // creating highlight sphere
        const sphereGeometry = new THREE.SphereGeometry( 0.025, 15, 15 );
        const sphereMaterial = new THREE.MeshBasicMaterial( { color: 'blue' } );
        this.gazeIntersectSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        this.worldIntersectSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

        // creating gaze line        
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 5 });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3( 0,0,0 ), new THREE.Vector3( 0,0,0 )] );
        this.gazeLine = new THREE.Line( lineGeometry, lineMaterial )
        

        // adding highlight to scene
        this.scene.add( this.gazeIntersectSphere );
        this.scene.add(this.worldIntersectSphere);
        this.scene.add( this.gazeLine ); 

    }

    public get_intersected_world_point( origin: Vector3, direction: Vector3 ): THREE.Vector3 {

        this.worldRaycaster.set( origin, direction.normalize() );

        const worldPoints = this.scene.getObjectByName('worldpointcloud');
        const intersects = worldPoints ? this.worldRaycaster.intersectObjects( [worldPoints], false ): [];

        if( intersects && intersects.length > 0){

            // plotting highlight sphere
            this.worldIntersectSphere.position.copy(intersects[0].point);
            this.worldIntersectSphere.scale.set(1,1,1);

            return intersects[0].point;

        }

        return new THREE.Vector3(0,0,0);

    }

    public get_intersected_point( camera: THREE.PerspectiveCamera ): {mousePosition: {top: number, left: number}, intersectPosition: THREE.Vector3, timestamp: number, gaze: { origin: THREE.Vector3, direction: THREE.Vector3 } } {

        // update the picking ray with the camera and pointer position
        this.rayCaster.setFromCamera( this.pointer, camera );

        // getting scene objects
        const sceneObject = this.scene.getObjectByName('gazepointcloud');
        const intersects = sceneObject ? this.rayCaster.intersectObjects( [sceneObject], false ) : [];
        if(intersects && intersects.length > 0){

            // setting visibility
            this.gazeIntersectSphere.visible = true;
            this.worldIntersectSphere.visible = true;
            this.gazeLine.visible = true;

            // plotting highlight sphere
            this.gazeIntersectSphere.position.copy(intersects[0].point);
            this.gazeIntersectSphere.scale.set(1,1,1);

            // plotting normal line
            // TODO: Trace raycaster from this line
            const rawGazeDirection: number[] = intersects[0].object.userData['normals'][intersects[0].index];
            const direction: THREE.Vector3 = new THREE.Vector3(rawGazeDirection[0], rawGazeDirection[1], rawGazeDirection[2] );   

            // setting current gaze direction line
            const origin: THREE.Vector3 = intersects[0].point;
            const destination: THREE.Vector3 = origin.clone().add(direction);
            this.gazeLine.geometry = new THREE.BufferGeometry().setFromPoints( [origin, destination] );

            // intersection with world
            this.get_intersected_world_point( origin, direction);

            // returning positions
            return {
                mousePosition: {top: this.pointerEvent.offsetY, left: this.pointerEvent.offsetX}, 
                intersectPosition: intersects[0].point, 
                timestamp:  intersects[0].object.userData['timestamps'][intersects[0].index],
                gaze: { origin, direction }
            }
            
        } else {

            // setting visibility
            this.gazeIntersectSphere.visible = false;
            this.worldIntersectSphere.visible = false;
            this.gazeLine.visible = false;

            // returning positions
            const emptyLine: THREE.Vector3 = new THREE.Vector3(0,0,0);
            return {mousePosition: {top: 0, left: 0}, intersectPosition: new THREE.Vector3(0,0,0), timestamp: -1, gaze: { origin: emptyLine, direction: emptyLine }};
        }
    }

    public on_pointer_move( event: MouseEvent, canvasContainer: HTMLElement ): void {

        // saving event pointer
        this.pointerEvent = event;
        
        // Ref: https://discourse.threejs.org/t/custom-canvas-size-with-orbitcontrols-and-raycaster/18742
        const rect = canvasContainer.getBoundingClientRect();
        this.pointer.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        this.pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    }

    public set_scene_events( canvasContainer: HTMLElement ): void {
        canvasContainer.addEventListener('pointermove', (event) => {this.on_pointer_move( event, canvasContainer)})
    }
    

}