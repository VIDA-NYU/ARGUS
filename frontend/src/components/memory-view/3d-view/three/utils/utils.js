function addVector3D(a, b){
    return [
        a[0] + b[0], a[1] + b[1], a[2] + b[2]
    ]
}
function multiplyVector3D(multiplier, vector){
    return [
        multiplier * vector[0], multiplier * vector[1], multiplier * vector[2]
    ];
}
export {addVector3D, multiplyVector3D}