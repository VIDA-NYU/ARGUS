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

// style
import './EyesDataView.css'
import { Transformations } from './utils/Transformations';
import { CatchingPokemonSharp } from '@mui/icons-material';

interface EyesDataViewProps {
  points: any
}

const EyesDataView = ({ type, title, data, recordingName, state, onProgress, onSeek }: any) => {

  // let container, stats;
  let camera, scene, renderer;
	// let points;

  // DOM Refs
  const containerRef = useRef(null);

  const initialize_scene = () => {

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const sprite = new THREE.TextureLoader().load( 'textures/sprites/disc.png' );

    for ( let i = 0; i < 10000; i ++ ) {

      const x = 2000 * Math.random() - 1000;
      const y = 2000 * Math.random() - 1000;
      const z = 2000 * Math.random() - 1000;

      vertices.push( x, y, z );

    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    const material = new THREE.PointsMaterial( { size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
    material.color.setHSL( 1.0, 0.3, 0.7 );

    const particles = new THREE.Points( geometry, material );
    scene.add( particles );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    renderer.render( scene, camera );

  };


  useEffect( () => {

    if(data.length){
      initialize_scene();
    }

  }, [data]);

  return (
    <AccordionView title='Eyes Data' height={600}>
        <Box sx={{ display: 'flex', width: '100%', height: '100%', overflow: 'auto' }}>
          <div style={{width: '600px', height: '600px'}} ref={containerRef}></div>
        </Box>
    </AccordionView>
  )
}

export default EyesDataView;





//     scene = new THREE.Scene();
//     scene.background = new THREE.Color( 0x050505 );
//     scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

//     const particles = 500000;
//     const geometry = new THREE.BufferGeometry();

//     const positions = [];
//     const colors = [];

//     const color = new THREE.Color();

//     const n = 1000, n2 = n / 2; // particles spread in the cube

//     for ( let i = 0; i < particles; i ++ ) {

//       // positions

//       const x = Math.random() * n - n2;
//       const y = Math.random() * n - n2;
//       const z = Math.random() * n - n2;

//       positions.push( x, y, z );

//       // colors

//       const vx = ( x / n ) + 0.5;
//       const vy = ( y / n ) + 0.5;
//       const vz = ( z / n ) + 0.5;

//       color.setRGB( vx, vy, vz );

//       colors.push( color.r, color.g, color.b );

//     }

//     geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
//     geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

//     geometry.computeBoundingSphere();

//     //

//     const material = new THREE.PointsMaterial( { size: 15, vertexColors: true } );

//     points = new THREE.Points( geometry, material );
//     scene.add( points );

//     //

//     renderer = new THREE.WebGLRenderer();
//     renderer.setPixelRatio( window.devicePixelRatio );
//     renderer.setSize( 600, 600 );

//     containerRef.current.appendChild( renderer.domElement );

//     render();