import open3d as o3d
from timeit import default_timer as timer
import numpy as np
import copy

## based on http://www.open3d.org/docs/latest/tutorial/Advanced/global_registration.html

def draw_registration_result(sourcepc, targetpc, transformation):
    source_temp = copy.deepcopy(sourcepc)
    target_temp = copy.deepcopy(targetpc)
    source_temp.paint_uniform_color([1, 0.706, 0])
    target_temp.paint_uniform_color([0, 0.651, 0.929])
    source_temp.transform(transformation)
    o3d.visualization.draw_geometries([source_temp, target_temp])


def preprocess_point_cloud(pcd, voxelsize):
    print(":: Downsample with a voxel size %.3f." % voxelsize)
    pcd_down = pcd.voxel_down_sample(voxelsize)

    radius_normal = voxelsize * 2
    print(":: Estimate normal with search radius %.3f." % radius_normal)
    pcd_down.estimate_normals(
        o3d.geometry.KDTreeSearchParamHybrid(radius=radius_normal, max_nn=30))

    radius_feature = voxelsize * 5
    print(":: Compute FPFH feature with search radius %.3f." % radius_feature)
    pcd_fpfh = o3d.pipelines.registration.compute_fpfh_feature(
        pcd_down,
        o3d.geometry.KDTreeSearchParamHybrid(radius=radius_feature, max_nn=100))
    return pcd_down, pcd_fpfh


def execute_global_registration(sourcedown, targetdown, sourcefpfh,
                                targetfpfh, voxelsize):
    distance_threshold = voxelsize * 1.5
    print(":: RANSAC registration on downsampled point clouds.")
    print("   Since the downsampling voxel size is %.3f," % voxelsize)
    print("   we use a liberal distance threshold %.3f." % distance_threshold)
    result = o3d.pipelines.registration.registration_ransac_based_on_feature_matching(
        sourcedown, targetdown, sourcefpfh, targetfpfh, False, distance_threshold,
        o3d.pipelines.registration.TransformationEstimationPointToPoint(False),
        4, [
            o3d.pipelines.registration.CorrespondenceCheckerBasedOnEdgeLength(0.9),
            o3d.pipelines.registration.CorrespondenceCheckerBasedOnDistance(distance_threshold)
        ], o3d.pipelines.registration.RANSACConvergenceCriteria(4000000, 500))
    return result


def refine_registration(sourcepc, targetpc, result_coarse, voxelsize):
    distance_threshold = voxelsize * 0.4
    print(":: Point-to-plane ICP registration is applied on original point")
    print("   clouds to refine the alignment. This time we use a strict")
    print("   distance threshold %.3f." % distance_threshold)
    result = o3d.pipelines.registration.registration_icp(
        sourcepc, targetpc, distance_threshold, result_coarse.transformation,
        o3d.pipelines.registration.TransformationEstimationPointToPlane())
    return result


def pairwise_registration(sourcepc, targetpc):
    print("Apply point-to-plane ICP")
    icp_coarse = o3d.pipelines.registration.registration_icp(
        sourcepc, targetpc, max_correspondence_distance_coarse, np.identity(4),
        o3d.pipelines.registration.TransformationEstimationPointToPlane())
    icp_fine = o3d.pipelines.registration.registration_icp(
        sourcepc, targetpc, max_correspondence_distance_fine,
        icp_coarse.transformation,
        o3d.pipelines.registration.TransformationEstimationPointToPlane())
    transformation_icp = icp_fine.transformation
    information_icp = o3d.pipelines.registration.get_information_matrix_from_point_clouds(
        sourcepc, targetpc, max_correspondence_distance_fine,
        icp_fine.transformation)
    return transformation_icp, information_icp


def full_registration(pcds, max_correspondence_distance_coarse,
                      max_correspondence_distance_fine):
    pose_graph = o3d.pipelines.registration.PoseGraph()
    odometry = np.identity(4)
    pose_graph.nodes.append(o3d.pipelines.registration.PoseGraphNode(odometry))
    n_pcds = len(pcds)
    for source_id in range(n_pcds):
        for target_id in range(source_id + 1, n_pcds):
            transformation_icp, information_icp = pairwise_registration(
                pcds[source_id], pcds[target_id])
            print("Build o3d.pipelines.registration.PoseGraph")
            if target_id == source_id + 1:  # odometry case
                odometry = np.dot(transformation_icp, odometry)
                pose_graph.nodes.append(
                    o3d.pipelines.registration.PoseGraphNode(
                        np.linalg.inv(odometry)))
                pose_graph.edges.append(
                    o3d.pipelines.registration.PoseGraphEdge(source_id,
                                                             target_id,
                                                             transformation_icp,
                                                             information_icp,
                                                             uncertain=False))
            else:  # loop closure case
                pose_graph.edges.append(
                    o3d.pipelines.registration.PoseGraphEdge(source_id,
                                                             target_id,
                                                             transformation_icp,
                                                             information_icp,
                                                             uncertain=True))
    return pose_graph


start = timer()

pcds = []
pcds.append(o3d.io.read_point_cloud("./pointcloud/2023.02.09-16.41.00-pointcloud0.025.pcd"))
pcds.append(o3d.io.read_point_cloud("./pointcloud/2023.02.09-17.41.40-pointcloud0.025.pcd"))
pcds.append(o3d.io.read_point_cloud("./pointcloud/2023.02.13-22.58.38-pointcloud0.025.pcd"))
pcds.append(o3d.io.read_point_cloud("./pointcloud/2023.02.13-23.00.42-pointcloud0.025.pcd"))
print("Time for loading the data:", timer() - start)

#pcds[0].paint_uniform_color([0.7, 0.3, 0.0])
#pcds[1].paint_uniform_color([0.0, 0.3, 0.7])
#o3d.visualization.draw([pcds[0] + pcds[1]])

#o3d.visualization.draw_geometries([pcds[1]], point_show_normal=True)
#o3d.visualization.draw_geometries([pcds[2]], point_show_normal=True)

voxel_size_orig = 0.025
voxel_size = 0.1
max_correspondence_distance_coarse = voxel_size * 15
max_correspondence_distance_fine = voxel_size * 1.5

#with o3d.utility.VerbosityContextManager(o3d.utility.VerbosityLevel.Debug) as cm:
#    pose_graph = full_registration(pcds, max_correspondence_distance_coarse, max_correspondence_distance_fine)
#print("Transform points and display")
#for point_id in range(len(pcds)):
#    print(pose_graph.nodes[point_id].pose)
#    pcds[point_id].transform(pose_graph.nodes[point_id].pose)
#o3d.visualization.draw_geometries(pcds)

target = pcds[0]
for idx in range(1, len(pcds)):
    source = pcds[idx]

    source_down, source_fpfh = preprocess_point_cloud(source, voxel_size)
    target_down, target_fpfh = preprocess_point_cloud(target, voxel_size)

    result_ransac = execute_global_registration(source_down, target_down, source_fpfh, target_fpfh, voxel_size)
    print(result_ransac)
    #draw_registration_result(source, target, result_ransac.transformation)

    result_icp = refine_registration(source, target, result_ransac, voxel_size)
    print(result_icp)
    #draw_registration_result(source, target, result_icp.transformation)

    source.transform(result_icp.transformation)
    target += source
    target = target.voxel_down_sample(voxel_size_orig)


print("Recompute the normal of the point cloud")
start = timer()
target.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=voxel_size_orig*2.0, max_nn=30))
print("Time for estimating PC normals:", timer() - start)
start = timer()
target.orient_normals_consistent_tangent_plane(50)
print("Time for orienting PC normals:", timer() - start)

o3d.io.write_point_cloud("./pointcloud/result.pcd", target, False, True)

#o3d.visualization.draw_geometries([target], point_show_normal=True)

print('Running ball pivoting surface reconstruction ...')
start = timer()
radii = [voxel_size_orig*1.5, voxel_size_orig*3.0]
mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_ball_pivoting(target, o3d.utility.DoubleVector(radii))
print("Time for running ball pivoting:", timer() - start)
print("Mesh vertices:", len(mesh.vertices))
#o3d.visualization.draw([mesh])

o3d.io.write_triangle_mesh("./pointcloud/result.ply", mesh)
