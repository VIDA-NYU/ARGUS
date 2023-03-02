import json
import open3d as o3d
from timeit import default_timer as timer

voxel_size = 0.025


#filename = "2023.02.09-16.41.00-pointcloud"
filename = "2023.02.09-17.41.40-pointcloud"
#filename = "2023.02.13-22.58.38-pointcloud"
#filename = "2023.02.13-23.00.42-pointcloud"


print('-- opening file')
f = open("./pointcloud/" + filename + ".json")
print('-- loading data')
data = json.load(f)
print('-- data loaded')
# Closing file
f.close()

print("Time steps:", len(data))

for i in data[0]:
    print(i)

# Iterating through the json list
xyz = []
pcl = o3d.geometry.PointCloud()
tmppcl = o3d.geometry.PointCloud()

start = timer()

for i in data:
    xyz = i['xyz_world']
    colors = i['color']
    for col in colors:
        col[0] = col[0] / 255.0
        col[1] = col[1] / 255.0
        col[2] = col[2] / 255.0
    tmppcl.points = o3d.utility.Vector3dVector(xyz)
    tmppcl.colors = o3d.utility.Vector3dVector(colors)
    pcl += tmppcl

print("Time for loading the data:", timer() - start)
print("PC points:", len(pcl.points))
#o3d.visualization.draw([pcl])

startTotal = timer()

print("Downsample the point cloud with a voxel of", voxel_size)
start = timer()
downpcd = pcl.voxel_down_sample(voxel_size)
print("PC points:", len(downpcd.points))
print("Time for downsamling the PC:", timer() - start)
#o3d.visualization.draw([downpcd])

print("Recompute the normal of the point cloud")
start = timer()
downpcd.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=voxel_size*2.0, max_nn=30))
print("Time for estimating PC normals:", timer() - start)
start = timer()
downpcd.orient_normals_consistent_tangent_plane(100)
print("Time for orienting PC normals:", timer() - start)
#downpcd.paint_uniform_color([0.7, 0.3, 0.0])
#o3d.visualization.draw_geometries([downpcd], point_show_normal=True)

print("Write point cloud")
o3d.io.write_point_cloud("./pointcloud/" + filename + str(voxel_size) + ".pcd", downpcd, False, True)
