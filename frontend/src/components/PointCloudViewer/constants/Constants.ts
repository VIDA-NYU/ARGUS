// third-party
import * as d3 from 'd3';

export const BASE_COLORS: { [pointCloudName: string]: number[] } = {

    'gazeorigin-pointcloud': [ 0.007, 0.219, 0.345 ], // BLUE 
    'gazeprojection-pointcloud': [0.501, 0.000, 0.149 ], // RED
    'lefthands-pointcloud': [0.000, 0.270, 0.160 ], // GREEN
    'righthands-pointcloud': [0.000, 0.270, 0.160 ], // GREEN

}

export const BASE_SCALES: { [voxelCloudName: string]: any } = {

    // 'gazeorigin-voxelcloud': d3.interpolateBlues, // BLUE 
    // 'gazeprojection-voxelcloud': d3.interpolateOranges, //ORANGE
    // 'lefthands-voxelcloud': d3.interpolatePurples, // PURPLE
    // 'righthands-voxelcloud': d3.interpolatePurples, // PURPLE

    // [ '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858' ]
    'gazeorigin-voxelcloud':     [ '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858' ], //BLUE
    'gazeprojection-voxelcloud': [ '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026' ], //RED
    'lefthands-voxelcloud': ['#addd8e', '#78c679', '#41ab5d', '#238443', '#238443', '#006837', '#004529'], // GREEN
    'righthands-voxelcloud': ['#addd8e', '#78c679', '#41ab5d', '#238443', '#238443', '#006837', '#004529'] // GREEN

    
    


}

export const CLEAR_BOUNDING_BOXES: { [pointCloudName: string]: number[][] } = {

    'world-pointcloud': [
        [0.29221351047609145, -0.3822375231399986, 2.7444635321128388],
        [1.3793701278552402, -0.015780158466257438, 1.3053496535312714]
    ]

} 
