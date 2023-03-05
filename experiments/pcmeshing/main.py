# 'C:/Users/krone/Nextcloud/data/ptg/pointcloud-office9-19.json'
import json
import open3d as o3d
from timeit import default_timer as timer

print('-- opening file')
f = open('./pointcloud-office9-19.json')
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
for i in data:
    xyz = i['xyz_world']
    colors = i['color']
    for col in colors:
        col[0] = col[0] / 255.0
        col[1] = col[1] / 255.0
        col[2] = col[2] / 255.0
    pcl.points.extend(o3d.utility.Vector3dVector(xyz))
    pcl.colors.extend(o3d.utility.Vector3dVector(colors))

print("Points:", len(pcl.points))
o3d.visualization.draw_geometries([pcl])

start = timer()

print("Downsample the point cloud with a voxel of 0.05")
#voxel_size = 0.05
voxel_size = 0.025
downpcd = pcl.voxel_down_sample(voxel_size)
print("PC points:", len(downpcd.points))
#o3d.visualization.draw_geometries([downpcd])

print("Recompute the normal of the point cloud")
downpcd.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=voxel_size*2.0, max_nn=30))
downpcd.orient_normals_consistent_tangent_plane(100)
#downpcd.paint_uniform_color([0.7, 0.3, 0.0])
#o3d.visualization.draw_geometries([downpcd], point_show_normal=True)
#o3d.visualization.draw([downpcd])

#print('Running Poisson surface reconstruction ...')
#mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(downpcd, depth=8)
#mesh.paint_uniform_color([0.0, 0.3, 0.7])
#print('Displaying reconstructed mesh ...')
#o3d.visualization.draw([mesh] + [downpcd])

print('Running ball pivoting surface reconstruction ...')
radii = [voxel_size*1.5, voxel_size*3.0, voxel_size*4.5]
mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_ball_pivoting(downpcd, o3d.utility.DoubleVector(radii))
#mesh.paint_uniform_color([0.0, 0.3, 0.7])
#o3d.visualization.draw([mesh] + [downpcd])
end = timer()
print("Runtime:", end - start)
o3d.visualization.draw([mesh])
print("Mesh vertices:", len(mesh.vertices))


number_of_iterations = 1
print('filter with average with', number_of_iterations, 'iterations')
mesh_out = mesh.filter_smooth_simple(number_of_iterations)
mesh_out.compute_vertex_normals()
#mesh_out.paint_uniform_color([0.3, 0.0, 0.7])
o3d.visualization.draw([mesh_out])

#mesh_smp = mesh_out.simplify_vertex_clustering(0.02, contraction=o3d.geometry.SimplificationContraction.Average)
#print("Simplified mesh vertices:", len(mesh_smp.vertices))
#o3d.visualization.draw([mesh_smp])