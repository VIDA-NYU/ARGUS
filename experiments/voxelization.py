import glob
import argparse
import os
import io
import json
import numpy as np
from timeit import default_timer as timer
import open3d as o3d

def load_point_cloud( filepath ): 

    pcFile = None
    with open(filepath) as f:
        pcFile = json.load(f)

    timestampedPointClouds = []
    for timestamp in pcFile:

        ## parsing raw data
        xyz = timestamp['xyz_world']
        colors = list( map( lambda row: [row[i]/255.0 for i in range(3)], timestamp['color'] ) )

        ## appeding to open3d data structure
        pcl = o3d.geometry.PointCloud()
        pcl.points = o3d.utility.Vector3dVector(xyz)
        pcl.colors = o3d.utility.Vector3dVector(colors)
        timestampedPointClouds.append(pcl)

    return timestampedPointClouds


def load_user_gaze( filepath ):

    gazeFile = None
    with open(filepath) as f:
        gazeFile = json.load(f)

    ## color scale
    colorStep = 1/len(gazeFile)

    xyz = []
    colors = []
    for index, timestamp in enumerate(gazeFile):
        xyz.append( [timestamp['GazeOrigin']['x'], timestamp['GazeOrigin']['y'], (-1)*timestamp['GazeOrigin']['z']] )
        colors.append([0, index*colorStep, 0])
    
    ## appeding to open3d data structure
    pcl = o3d.geometry.PointCloud()
    pcl.points = o3d.utility.Vector3dVector(xyz)
    pcl.colors = o3d.utility.Vector3dVector(colors)

    return pcl

def downsample_point_clouds( pointClouds, voxelSize = 0.025 ):

    downPcds = [ pc.voxel_down_sample(voxelSize) for pc in pointClouds ]
    return downPcds


# def save_downsampled_point_clouds( pointCloudJson ):



def merge_point_clouds( pointClouds ):
    
    mergedPointClouds = []
    mergedColors = []
    # mergedNormals = []
    for pcd in pointClouds:

        mergedPointClouds.extend( np.asarray(pcd.points).tolist() )
        mergedColors.extend( np.asarray(pcd.colors).tolist() )
        # mergedNormals.extend( np.asarray(pcd.normals).tolist() )
    
    return {'xyz_world': mergedPointClouds, 'colors': mergedColors}

def main( pointCloudPath, gazePointCloudPath, voxelization = True ):

    ## parameters
    voxelSize = 0.055

    ## collection of point clouds
    open3DPointClouds = None
    open3DGazeClouds = None

    print('Loading point cloud...')
    start = timer()
    open3DPointClouds = load_point_cloud( pointCloudPath )
    print('\tTime taken: ', timer() - start )

    print('Loading gaze cloud...')
    start = timer()
    open3DGazeClouds = load_user_gaze( gazePointCloudPath )
    print('\tTime taken: ', timer() - start )

    
    if(voxelization == True):
        start = timer()
        print('Downsampling point cloud...')
        open3DPointClouds = downsample_point_clouds( open3DPointClouds, voxelSize )
        print('\tTime taken: ', timer() - start )
        print('\tNumber of pcs: ', len(open3DPointClouds))


    print("Recompute the normal of the point cloud")
    start = timer()
    for pcd in open3DPointClouds:
        pcd.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=voxelSize*2.0, max_nn=30))
        pcd.orient_normals_consistent_tangent_plane(100)
        # pcd.paint_uniform_color([0.7, 0.3, 0.0])
    print('\tTime taken: ', timer() - start )
    

    ## merging point clouds
    mergedPointClouds = merge_point_clouds( open3DPointClouds )
    pcl = o3d.geometry.PointCloud()
    pcl.points = o3d.utility.Vector3dVector(mergedPointClouds['xyz_world'])
    pcl.colors = o3d.utility.Vector3dVector(mergedPointClouds['colors'])

    print('Number of points: ', len(mergedPointClouds['xyz_world']))

    o3d.visualization.draw_geometries([pcl, open3DGazeClouds], point_show_normal=True)



if __name__ == "__main__":

    ## example: python ../preprocessing/spectrograms/spectrogramGenerator.py --audiopath './queries/audio/*/*/*'

    parser = argparse.ArgumentParser(description='Arguments for point cloud voxelization.')

    parser.add_argument('-p', '--pointcloudpath', nargs=1, required=True, default='')
    parser.add_argument('-g', '--gazepointcloud', nargs=1, required=True, default='')
    parser.add_argument('-v', '--voxelization', nargs=1, required=False, default=False)
    parser.add_argument('-s', '--visualize', nargs=1, required=False, default=True)

    args = parser.parse_args()
    main(args.pointcloudpath[0], args.gazepointcloud[0])
