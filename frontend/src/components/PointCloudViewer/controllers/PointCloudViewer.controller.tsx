import { Scene } from "../model/Scene";

export class PointCloudViewerController {

    // refs
    public scene!: Scene;
    // public dataset!: Dataset;

    constructor(){}

    public async initialize_controller( containerRef: HTMLElement ): Promise<void> {

        // initializing dataset
        // const dataset: Dataset = await this.initialize_dataset();
        // this.dataset = dataset;

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

}