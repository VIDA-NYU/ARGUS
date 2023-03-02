import open3d as o3d
from timeit import default_timer as timer
import numpy as np
import copy


start = timer()

pcds = []
#pcds.append(o3d.io.read_point_cloud("./pointcloud/2023.02.09-16.41.00-pointcloud0.025.pcd"))
pcds.append(o3d.io.read_point_cloud("./pointcloud/2023.02.09-17.41.40-pointcloud0.025reg.pcd"))
pcds.append(o3d.io.read_point_cloud("./pointcloud/2023.02.13-22.58.38-pointcloud0.025reg.pcd"))
#pcds.append(o3d.io.read_point_cloud("./pointcloud/2023.02.13-23.00.42-pointcloud0.025reg.pcd"))
#pcds.append(o3d.io.read_point_cloud("./pointcloud/result.pcd"))
print("Time for loading the data:", timer() - start)

pcds[0].paint_uniform_color([0.0, 0.5, 0.9])
pcds[1].paint_uniform_color([0.9, 0.5, 0.0])
#pcds[2].paint_uniform_color([0.5, 0.9, 0.0])
#pcds[3].paint_uniform_color([0.9, 0.9, 0.0])

dist = o3d.geometry.PointCloud.compute_point_cloud_distance(pcds[1], pcds[0])
threshold = 0.013
distcol = []
for d in dist:
    if d > threshold:
        distcol.append([0.9, 0.0, 0.0])
    else:
        # distcol.append([0.9, 0.5, 0.0])
        distcol.append([0.5, 0.5, 0.5])
pcds[1].colors = o3d.utility.Vector3dVector(distcol)

dist = o3d.geometry.PointCloud.compute_point_cloud_distance(pcds[0], pcds[1])
distcol = []
for d in dist:
    if d > threshold:
        distcol.append([0.0, 0.0, 0.9])
    else:
        # distcol.append([0.0, 0.5, 0.9])
        distcol.append([0.5, 0.5, 0.5])
pcds[0].colors = o3d.utility.Vector3dVector(distcol)


o3d.visualization.draw_geometries(pcds)
