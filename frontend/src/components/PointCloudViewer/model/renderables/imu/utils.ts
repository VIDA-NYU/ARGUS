function rpy21(x, y, z){
/*
Rotation from frame 2 to frame 1 using euler angles of roll (x), pitch (y), yaw (z)
Order of transformation is of extreme importance. The order used is z-y-x
*/
let R = [[Math.cos(y)*Math.cos(z), Math.sin(x)*Math.sin(y)*Math.cos(z)-Math.sin(z)*Math.cos(x), Math.cos(x)*Math.sin(y)*Math.cos(z)+Math.sin(x)*Math.sin(z)],
        [Math.sin(z)*Math.cos(y),  Math.sin(x)*Math.sin(y)*Math.sin(z)+Math.cos(z)*Math.cos(x), Math.cos(x)*Math.sin(y)*Math.sin(z)-Math.sin(y)*Math.cos(z)],
        [-Math.sin(y),             Math.sin(x)*Math.cos(y),                                     Math.cos(y)*Math.cos(x)               ]]
return R
}


function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}


function rpy12(x, y, z){
  /*
  Rotation from frame 1 to frame 2 using euler angles of roll (x), pitch (y), yaw (z)
  Order of transformation is of extreme importance. The order used is z-y-x
  */
  return transpose(rpy21(x, y, z))
}


function get_sec_from_start_arr(eye_dict){
  let sfs_arr = []
  let start_time = eye_dict[0]["timestamp"].slice(0, -2)
  for(let i = 0; i < eye_dict.length; i++){
    sfs_arr.push((parseFloat(eye_dict[i]["timestamp"].slice(0, -2)) - parseFloat(start_time))/1000)
  }
  return sfs_arr
}


function get_rpy_arr(imu_gyro_arr_sampled, sfs_arr){
  let rpy_arr = []
  for(let i = 0; i < sfs_arr.length - 1; i++){
    rpy_arr.push([(sfs_arr[i + 1] - sfs_arr[i])*imu_gyro_arr_sampled[i][0], (sfs_arr[i + 1] - sfs_arr[i])*imu_gyro_arr_sampled[i][1], (sfs_arr[i + 1] - sfs_arr[i])*imu_gyro_arr_sampled[i][2]])
  }
  return rpy_arr
}


function get_all_rms(rpy_arr){
  let rms = []
  for (let i = 0; i < rpy_arr.length; i++){
    rms.push(rpy12(rpy_arr[i][0], rpy_arr[i][1], rpy_arr[i][2]))
  }
  return rms
}


function multiply(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
}
  

function get_rotated_imu_vectors(imu_vector_arr, gaze_data, rms){
  let rotated_imu_vector_arr = [{"timestamp": gaze_data[0]['timestamp'], "origin": {"x": imu_vector_arr[0][0], "y": imu_vector_arr[0][1], "z": imu_vector_arr[0][2]}, "direction": {"x": imu_vector_arr[0][3], "y": imu_vector_arr[0][4], "z": imu_vector_arr[0][5]}}]
  for (let i = 0; i < imu_vector_arr.length - 1; i++){
    let p1 = imu_vector_arr[i].slice(3, 6)
    for (let j = 0; j < i; j++){
      p1 = multiply(rms[i], p1)
    }
    rotated_imu_vector_arr.push({"timestamp": gaze_data[i]['timestamp'], "origin": {"x": imu_vector_arr[i][0], "y": imu_vector_arr[i][1], "z":imu_vector_arr[i][2]}, "direction": {"x": p1[0], "y": p1[1], "z": p1[2]}})
  }
  return rotated_imu_vector_arr
}


export {rpy21, rpy12, get_sec_from_start_arr, get_rpy_arr, get_all_rms, get_rotated_imu_vectors};