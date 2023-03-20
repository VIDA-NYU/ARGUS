// third-party
import * as d3 from 'd3';

export const BASE_COLORS: { [pointCloudName: string]: number[] } = {

    'gazeorigin-pointcloud': [0.215, 0.494, 0.721 ], // BLUE 
    'gazeprojection-pointcloud': [0.996, 0.498, 0.01 ], //ORANGE
    'lefthands-pointcloud': [0.596, 0.305, 0.639 ], // PURPLE
    'righthands-pointcloud': [0.596, 0.305, 0.639 ], // PURPLE

}

export const BASE_SCALES: { [voxelCloudName: string]: any } = {

    'gazeorigin-voxelcloud': d3.interpolateBlues, // BLUE 
    'gazeprojection-voxelcloud': d3.interpolateOranges, //ORANGE
    'lefthands-voxelcloud': d3.interpolatePurples, // PURPLE
    'righthands-voxelcloud': d3.interpolatePurples, // PURPLE

}