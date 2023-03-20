import {rpy21, rpy12, get_sec_from_start_arr, get_rpy_arr, get_all_rms, get_rotated_imu_vectors} from "../utils";

let gaze_data = sceneData.pointCloudData["gaze"]
let imu_accel_arr = sceneData.IMUAccelData
let imu_gyro_arr = sceneData.IMUGyroData


//Sample accel/gyro arrs to be the same length as eye gaze (one accel/gyro value for each timestep)
let imu_accel_arr_sampled = imu_accel_arr.map((obj, index) => (imu_accel_arr[index * Math.floor(imu_accel_arr.length/gaze_data.length)]));

let imu_gyro_arr_sampled = imu_gyro_arr.map((obj, index) => (imu_gyro_arr[index * Math.floor(imu_gyro_arr.length/gaze_data.length)]));

//Match accel values with head position (eye gaze origin)
let imu_vector_arr = gaze_data.map((obj, index) => ([gaze_data[index]['GazeOrigin']['x'], gaze_data[index]['GazeOrigin']['y'], gaze_data[index]['GazeOrigin']['z'], gaze_data[index]['GazeOrigin']['x'] + imu_accel_arr_sampled[index][0], gaze_data[index]['GazeOrigin']['y'] + imu_accel_arr_sampled[index][1], gaze_data[index]['GazeOrigin']['z'] + imu_accel_arr_sampled[index][2]]));

//get seconds from start and roll pitch yaw arrays
let sfs_arr = get_sec_from_start_arr(gaze_data)
let rpy_arr = get_rpy_arr(imu_gyro_arr_sampled, sfs_arr)

//get all rotation matrices
let rms = get_all_rms(rpy_arr)

//get final rotated imu vectors
//Format: array of objects {timestamp: , origin: {x:, y:, z:}, direction: {x:, y:, z:}}
let rotated_imu_vectors = get_rotated_imu_vectors(imu_vector_arr, gaze_data, rms)