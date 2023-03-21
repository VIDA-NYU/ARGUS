import {rpy21, rpy12, get_sec_from_start_arr, get_rpy_arr, get_all_rms, get_rotated_imu_vectors} from './utils';

// TODO: Understand what's being done here

// let gaze_data = sceneData.pointCloudData["gaze"]
// let imu_accel_arr = sceneData.IMUAccelData
// let imu_gyro_arr = sceneData.IMUGyroData


// //Sample accel/gyro arrs to be the same length as eye gaze (one accel/gyro value for each timestep)
// let imu_accel_arr_sampled = []
// for (let i = 0; i < gaze_data.length; i++){
//     imu_accel_arr_sampled.push(imu_accel_arr[i * Math.floor(imu_accel_arr.length/gaze_data.length)])
// }

// let imu_gyro_arr_sampled = []
// for (let i = 0; i < gaze_data.length; i++){
//   imu_gyro_arr_sampled.push(imu_gyro_arr[i * Math.floor(imu_gyro_arr.length/gaze_data.length)])
// }
// //Match accel values with head position (eye gaze origin)
// let imu_vector_arr = []
// for (let i = 0; i < gaze_data.length; i++){
//     imu_vector_arr.push([gaze_data[i]['GazeOrigin']['x'], gaze_data[i]['GazeOrigin']['y'], gaze_data[i]['GazeOrigin']['z'], gaze_data[i]['GazeOrigin']['x'] + imu_accel_arr_sampled[i][0], gaze_data[i]['GazeOrigin']['y'] + imu_accel_arr_sampled[i][1], gaze_data[i]['GazeOrigin']['z'] + imu_accel_arr_sampled[i][2]])
// }

// //get seconds from start and roll pitch yaw arrays
// let sfs_arr = get_sec_from_start_arr(gaze_data)
// let rpy_arr = get_rpy_arr(imu_gyro_arr_sampled, sfs_arr)

// //get all rotation matrices
// let rms = get_all_rms(rpy_arr)

// //get final rotated imu vectors
// //Format: array of objects {timestamp: , origin: {x:, y:, z:}, direction: {x:, y:, z:}}
// let rotated_imu_vectors = get_rotated_imu_vectors(imu_vector_arr, gaze_data, rms)