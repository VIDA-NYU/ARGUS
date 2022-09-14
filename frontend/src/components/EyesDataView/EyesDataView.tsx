// templates
import AccordionView from '../../templates/AccordionView/AccordionView';

// material
import { Box } from '@mui/system';

// temp
import JSONPretty from 'react-json-pretty';

// react
import { useEffect, useRef } from 'react';

// third-party
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


// style
import './EyesDataView.css'
import { Transformations } from './utils/Transformations';

interface EyesDataViewProps {
  points: any
}

const EyesDataView = ({ type, title, data, recordingName, state, onProgress, onSeek }: any) => {

  // DOM Refs
  const containerRef = useRef(null);

  let camera, scene, renderer;
  let points;
  let controls;

  let currentPoints;

  const initialize_scene = () => {

    camera = new THREE.PerspectiveCamera( 75, 1600/600, 0.1, 1000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 'white' );
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    // const geometry = new THREE.BoxGeometry( 51, 51, 51 );
    // const material = new THREE.MeshBasicMaterial( {color: 'red', transparent: true, opacity: 0.5} );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    // const planegeometry = new THREE.PlaneGeometry( 50, 50 );
    // const planematerial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    // const plane = new THREE.Mesh( planegeometry, planematerial );
    // plane.rotation.x = Math.PI / 2;
    // plane.position.set(0, -25.5, 0 );
    // scene.add( plane );

    const helper = new THREE.GridHelper( 50, 50 );
    helper.position.set(0, -25.5, 0 );
    scene.add( helper );


    // const axesHelper = new THREE.AxesHelper( 76 );
    // scene.add( axesHelper );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 1600, 600 );

    containerRef.current.appendChild( renderer.domElement );

    const pointgeometry = new THREE.BufferGeometry();

    // getting normalized data
    const arrays = Transformations.normalize_data( data );

    pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( arrays.normalizedData, 3 ) );
    pointgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( arrays.colors, 3 ) );
    pointgeometry.computeBoundingSphere();


    const pointmaterial = new THREE.PointsMaterial( { size: 1, vertexColors: true, transparent: true, opacity: 0.1 } );

    points = new THREE.Points( pointgeometry, pointmaterial );
    scene.add( points );

    controls = new OrbitControls( camera, renderer.domElement );

  };

  const add_highlighted_point = () => {

    scene.remove(currentPoints);

    const pointgeometry = new THREE.BufferGeometry();

    const pointPosition: number[] = [
      Math.random()*50 - 25, -24, Math.random()*50 - 25, 
    ]

    pointgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( pointPosition, 3 ) );

    const color = new THREE.Color();
    const highlightcolors = [];
    color.setRGB( 255, 0, 0 );
    highlightcolors.push( color.r, color.g, color.b );
    pointgeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( highlightcolors, 3 ) );
    const pointmaterial = new THREE.PointsMaterial( { size: 1, vertexColors: true } );

    
    currentPoints = new THREE.Points( pointgeometry, pointmaterial );
    scene.add( currentPoints );

  };

  function animate() {

    requestAnimationFrame( animate );
  
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
  
    renderer.render( scene, camera );
  
  }


  useEffect( () => {

    if(data.length){
      initialize_scene();
      animate();

      setInterval( () => {
        add_highlighted_point();
      }, 1000)
    }

    

  }, [data]);

  return (
    <AccordionView title='Eyes Data' height={600}>
        <Box sx={{ display: 'flex', width: '100%', height: '100%', overflow: 'auto' }}>
          <div style={{width: '1600px', height: '600px'}} ref={containerRef}></div>
        </Box>
    </AccordionView>
  )
}

export default EyesDataView;