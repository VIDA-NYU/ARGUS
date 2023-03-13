// third-party
// import * as d3 from 'd3';
import * as THREE from 'three';

export class WorldPointCloud {

    // world extents
    public xExtent: number[] = [];
    public yExtent: number[] = [];
    public zExtent: number[] = [];

    // 

    constructor( public worldCoords: number[][], public worldColors: number[][] ){

        // calculating world extents
        this.calculate_world_extents( worldCoords );

    }

    public get_buffer_positions(): [number[], number[]] {

        return [this.worldCoords.flat(), this.worldColors.flat()];

    }

    public add_to_scene( scene: THREE.Scene ): void {

        // getting raw data
        const [coords, colors] = this.get_buffer_positions();

        // loading positions
        const pointgeometry = new THREE.BufferGeometry();
        pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( coords, 3 ) );
        pointgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        pointgeometry.computeBoundingBox();
        // pointgeometry.computeBoundingSphere();

        // defining material
        // let pointmaterial: THREE.PointsMaterial = new THREE.PointsMaterial( { size: 0.015, color: 'red' } );
        const pointmaterial = new THREE.PointsMaterial( { size: 0.015, vertexColors: true } );
        const points = new THREE.Points( pointgeometry, pointmaterial );
        // points.userDatas = { timestamps, normals };


        // // adding to scene
        // points.name = name
        // this.scene.add( points );

        // // returning points
        // return points;

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