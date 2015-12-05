function generateTubeGeometry(color) {

  var outerRadius = 0.3;
  var innerRadius = 0.15;
  var segments = 16;
  var radiusSegments = 16;
  var tubeColor = color;
  var endTubeColor = color;
  var wireframe = false;

  var tubePath1 = [{"point" :new THREE.Vector3(0,0,0)},{"point" :new THREE.Vector3(0,0.3,0)}];
  var actualPoints =[];
  for(var i = 0; i < tubePath1.length; i++) {
    actualPoints.push(tubePath1[i].point);
  }
  var actualExtrudePath = new THREE.CatmullRomCurve3(actualPoints);
  actualExtrudePath.dynamic = true;

  var outerTube = new THREE.TubeGeometry(actualExtrudePath, segments, outerRadius ,radiusSegments, false, false);
  outerTube.dynamic = true;
  outerTube.verticesNeedUpdate = true;
  outerTube.dynamic = true;

  var outerTubeMesh = new THREE.Mesh(outerTube, new THREE.MeshBasicMaterial(
  { color: tubeColor, shading: THREE.SmoothShading, side: THREE.DoubleSide, wireframe: wireframe, transparent: true,vertexColors: THREE.FaceColors, overdraw: false
  }));
  outerTubeMesh.name = "outerTube";
  outerTubeMesh.dynamic = true;
  outerTubeMesh.needsUpdate = true;
  renderer.sortObjects = false;

  var innerTube = new THREE.TubeGeometry(actualExtrudePath, segments,innerRadius ,radiusSegments, false, false);
  innerTube.dynamic = true;
  innerTube.verticesNeedUpdate = true;
  innerTube.dynamic = true;

  var innerTubeMesh = new THREE.Mesh(innerTube, new THREE.MeshBasicMaterial(
  { color: tubeColor, shading: THREE.SmoothShading, side: THREE.DoubleSide, wireframe: wireframe, transparent: true,vertexColors: THREE.FaceColors, overdraw: false
  }));
  innerTubeMesh.name = "innerTube";
  innerTubeMesh.dynamic = true;
  innerTubeMesh.needsUpdate = true;
  renderer.sortObjects = false;

  var first = new THREE.Geometry()
  for (i = 0; i < radiusSegments;i++) {
    var j = i;
    var k= i*6;

    first.vertices.push(outerTube.vertices[j+0].clone());
    first.vertices.push(outerTube.vertices[j+1].clone());
    first.vertices.push(innerTube.vertices[j+0].clone());
    first.faces.push( new THREE.Face3( k+0, k+1, k+2 ) );
    first.vertices.push(innerTube.vertices[j+0].clone());
    first.vertices.push(innerTube.vertices[j+1].clone());
    first.vertices.push(outerTube.vertices[j+1].clone());
    first.faces.push( new THREE.Face3( k+3, k+4, k+5 ) );

  };

  first.mergeVertices()
  var firstMesh = new THREE.Mesh(first, new THREE.MeshBasicMaterial(
       { color: endTubeColor, shading: THREE.SmoothShading, side: THREE.DoubleSide, wireframe: wireframe, transparent: true,vertexColors: THREE.FaceColors, overdraw: false}));

  var second = new THREE.Geometry()
  for (i = 0; i < radiusSegments;i++) {
    var j = i;
    var k= i*6;

    second.vertices.push(outerTube.vertices[outerTube.vertices.length-2-j+0].clone());
    second.vertices.push(outerTube.vertices[outerTube.vertices.length-2-j+1].clone());
    second.vertices.push(innerTube.vertices[outerTube.vertices.length-2-j+0].clone());
    second.faces.push( new THREE.Face3( k+0, k+1, k+2 ) );
    second.vertices.push(innerTube.vertices[outerTube.vertices.length-2-j+0].clone());
    second.vertices.push(innerTube.vertices[outerTube.vertices.length-2-j+1].clone());
    second.vertices.push(outerTube.vertices[outerTube.vertices.length-2-j+1].clone());
    second.faces.push( new THREE.Face3( k+3, k+4, k+5 ) );
  };

  second.mergeVertices()
  var secondMesh = new THREE.Mesh(second, new THREE.MeshBasicMaterial(
       { color: endTubeColor, shading: THREE.SmoothShading, side: THREE.DoubleSide, wireframe: wireframe, transparent: true,vertexColors: THREE.FaceColors, overdraw: false}));

  return {
    outer: outerTubeMesh,
    inner: innerTubeMesh,
    first: firstMesh,
    second: secondMesh
  };
}
