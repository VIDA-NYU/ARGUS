// model
import { Dataset } from "../model/Dataset";
import { Scene } from "../model/Scene";

// types
// import { VoxelCube } from "../../../types/DataTypes";
import { GazePointCloudRaw, VoxelCube, WorldPointCloudRaw } from "../../../types/types";
import { TimestampManager } from "./TimestampManager";

export class PointCloudViewerController {

    // refs
    public scene!: Scene;
    public dataset!: Dataset;
    public timestampManager!: TimestampManager;

    constructor(){}


    public render_world_point_cloud(): void {

        console.log('adding to scene...');
        const [worldBufferPositions, worldBufferColors]: [number[], number[]] = this.dataset.worldPointCloud.get_buffer_positions();
        this.scene.add_world_point_cloud( worldBufferPositions, worldBufferColors );

    }

    public play_gaze_animation( currentIndex: number ): void {

        if(this.dataset.worldPointCloud.gazeDirectionHighlightedPointsGroup){
            this.scene.scene.remove(this.dataset.worldPointCloud.gazeDirectionHighlightedPointsGroup);
        }

        if( this.dataset.gazePointCloud.currentHighlightedGazeDirection && this.dataset.gazePointCloud.currentHighlightedGazePoint ){
            this.scene.scene.remove(this.dataset.gazePointCloud.currentHighlightedGazeDirection);
            this.scene.scene.remove(this.dataset.gazePointCloud.currentHighlightedGazePoint);
        }

        const [gazeBufferPositions, gazeBufferNormals]: [number[], number[]] = this.dataset.gazePointCloud.get_buffer_positions(currentIndex, currentIndex+1);
        const [points, directions]: [THREE.Points, THREE.Line] = this.scene.add_gaze_point_cloud( gazeBufferPositions, gazeBufferNormals );

        // saving highlighted pointcloud
        this.dataset.gazePointCloud.currentHighlightedGazeDirection = directions;
        this.dataset.gazePointCloud.currentHighlightedGazePoint = points;

        // let i = 0;
        // setInterval( () => {

        //     if(this.dataset.worldPointCloud.gazeDirectionHighlightedPointsGroup){
        //         this.scene.scene.remove(this.dataset.worldPointCloud.gazeDirectionHighlightedPointsGroup);
        //     }

        //     const [gazeBufferPositions, gazeBufferNormals]: [number[], number[]] = this.dataset.gazePointCloud.get_buffer_positions(i, i+1);
        //     this.scene.add_gaze_point_cloud( gazeBufferPositions, gazeBufferNormals );
    
        //     // // getting intersected voxels
        //     // const intersectedVoxelCenterpoints = this.scene.get_intersected_voxels_centerpoint( gazeBufferPositions, gazeBufferNormals );
        //     // const [intersectedVoxelPositions, intersectedVoxelColors]: [number[], number[]] = this.dataset.worldPointCloud.get_corresponding_voxel_points( intersectedVoxelCenterpoints );
            
        //     // // this.scene.add_gaze_point_cloud( intersectedVoxelPositions, intersectedVoxelColors );
        //     // const highlightedPoints: THREE.Points = this.scene.add_world_point_cloud( intersectedVoxelPositions, intersectedVoxelColors );
        //     // this.dataset.worldPointCloud.gazeDirectionHighlightedPointsGroup = highlightedPoints;


        //     // const intersectedVoxelCubes: VoxelCube[] = this.dataset.worldPointCloud.get_corresponding_voxel_cubes( intersectedVoxelCenterpoints );

        //     // const highlightedVoxelsGroup: THREE.Group = this.scene.add_voxel_grid( intersectedVoxelCubes, 'red', 0.5 );
        //     // this.dataset.worldPointCloud.gazeDirectionHighlightedCubesGroup = highlightedVoxelsGroup;

        //     // incrementing timestamp
        //     i++;

        // }, 500);

    }

    public async initialize_controller( containerRef: HTMLElement ): Promise<void> {

        // initializing dataset
        const dataset: Dataset = await this.initialize_dataset();
        this.dataset = dataset;

        // initializing scene
        const scene: Scene = this.initialize_scene( containerRef );
        this.scene = scene;

        // const cubes: VoxelCube[] = this.dataset.worldPointCloud.get_corresponding_voxel_cubes(this.dataset.gazePointCloud.points);

        // adding voxel grid
        // this.scene.add_voxel_grid(this.dataset.worldPointCloud.get_voxel_cubes());
        // this.scene.add_voxel_grid(cubes, 'red', 0.5);
        
        console.log('rendering...');
        this.scene.render();

        // console.log('adding to scene...');
        // const [worldBufferPositions, worldBufferColors]: [number[], number[]] = this.dataset.worldPointCloud.get_buffer_positions();
        // this.scene.add_world_point_cloud( worldBufferPositions, worldBufferColors );

        // let i = 0;
        // setInterval( () => {

        //     if(this.dataset.worldPointCloud.gazeDirectionHighlightedPointsGroup){
        //         this.scene.scene.remove(this.dataset.worldPointCloud.gazeDirectionHighlightedPointsGroup);
        //     }

        //     const [gazeBufferPositions, gazeBufferNormals]: [number[], number[]] = this.dataset.gazePointCloud.get_buffer_positions(i, i+1);
        //     this.scene.add_gaze_point_cloud( gazeBufferPositions, gazeBufferNormals );
    
        //     // getting intersected voxels
        //     const intersectedVoxelCenterpoints = this.scene.get_intersected_voxels_centerpoint( gazeBufferPositions, gazeBufferNormals );
        //     // const intersectedVoxelCubes: VoxelCube[] = this.dataset.worldPointCloud.get_corresponding_voxel_cubes( intersectedVoxelCenterpoints );
        //     const [intersectedVoxelPositions, intersectedVoxelColors]: [number[], number[]] = this.dataset.worldPointCloud.get_corresponding_voxel_points( intersectedVoxelCenterpoints );
            
        //     // this.scene.add_gaze_point_cloud( intersectedVoxelPositions, intersectedVoxelColors );
        //     const highlightedPoints: THREE.Points = this.scene.add_world_point_cloud( intersectedVoxelPositions, intersectedVoxelColors );
        //     this.dataset.worldPointCloud.gazeDirectionHighlightedPointsGroup = highlightedPoints;

        //     // const highlightedVoxelsGroup: THREE.Group = this.scene.add_voxel_grid( intersectedVoxelCubes, 'red', 0.5 );
        //     // this.dataset.worldPointCloud.gazeDirectionHighlightedCubesGroup = highlightedVoxelsGroup;

        //     // incrementing timestamp
        //     i++;

        // }, 500);

    }

    public initialize_scene( containerRef: HTMLElement ): Scene {

        // creating scene
        const scene: Scene = new Scene();
        scene.init( containerRef, [0,0,10] );

        return scene;

    }

    public async initialize_dataset(): Promise<Dataset> {

        // creating dataset
        const dataset: Dataset = new Dataset();
        // await dataset.initialize_dataset( worldPointCloudRaw );

        // saving dataset ref
        return dataset;

    }

    public initialize_timestamp_manager(): void {

        // getting gaze timestamps
        const gazeTimestamps: number[] = this.dataset.gazePointCloud.get_all_timestamps();
        
        // creating timestamp manager
        this.timestampManager = new TimestampManager();
        this.timestampManager.generate_gaze_timestamp_index( gazeTimestamps );

    }

    // ****** Streams initialization ****** //
    
    public initialize_world_point_cloud_dataset( worldPointCloudRaw: WorldPointCloudRaw[] ): void {
        
        // saving world point cloud
        this.dataset.initialize_world_pointcloud_dataset( worldPointCloudRaw );

        // adding voxel grid
        this.scene.add_voxel_grid(this.dataset.worldPointCloud.get_voxel_cubes());
    }

    public initialize_gaze_point_cloud_dataset( gazePointCloudRaw: GazePointCloudRaw[] ): void {

        // saving gaze point cloud
        this.dataset.initialize_gaze_point_cloud_dataset( gazePointCloudRaw );
    }

    // ****** ******************** ****** //

}