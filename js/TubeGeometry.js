function generateTubeGeometry(color) {

  var outerRadius = 0.2;
  var innerRadius = 0.1;
  var segments = 16;
  var radiusSegments = 16;
  var tubeColor = color;
  var endTubeColor = color;

  var tubePath = [{"point": new THREE.Vector3(0, -0.1, 0)}, {"point": new THREE.Vector3(0, 0.5, 0)}];
  var actualPoints = [];
  for(var i = 0; i < tubePath.length; i++) {
    actualPoints.push(tubePath[i].point);
  }
  var actualExtrudePath = new THREE.CatmullRomCurve3(actualPoints);
  
  var outerTube = new THREE.TubeGeometry(actualExtrudePath, segments, outerRadius, radiusSegments, false);
  outerTube.dynamic = true;
  outerTube.verticesNeedUpdate = true;
  outerTube.dynamic = true;

  var outerTubeMesh = new THREE.Mesh(outerTube, new THREE.MeshLambertMaterial({
    color: tubeColor, side: THREE.DoubleSide
  }));
  outerTubeMesh.name = "outerTube";
  outerTubeMesh.dynamic = true;
  outerTubeMesh.needsUpdate = true;
  renderer.sortObjects = false;

  var innerTube = new THREE.TubeGeometry(actualExtrudePath, segments, innerRadius, radiusSegments, false);
  innerTube.dynamic = true;
  innerTube.verticesNeedUpdate = true;
  innerTube.dynamic = true;

  var innerTubeMesh = new THREE.Mesh(innerTube, new THREE.MeshLambertMaterial({
    color: tubeColor, side: THREE.DoubleSide
  }));
  innerTubeMesh.name = "innerTube";
  innerTubeMesh.dynamic = true;
  innerTubeMesh.needsUpdate = true;
  renderer.sortObjects = false;

  var first = new THREE.Geometry();
  for (i = 0; i < radiusSegments; i++) {
    var j = i;
    var k = i * 6;

    first.vertices.push(outerTube.vertices[j+0].clone());
    first.vertices.push(outerTube.vertices[j+1].clone());
    first.vertices.push(innerTube.vertices[j+0].clone());
    first.faces.push( new THREE.Face3( k+0, k+1, k+2 ) );
    first.vertices.push(innerTube.vertices[j+0].clone());
    first.vertices.push(innerTube.vertices[j+1].clone());
    first.vertices.push(outerTube.vertices[j+1].clone());
    first.faces.push( new THREE.Face3( k+3, k+4, k+5 ) );

  };

  first.computeFaceNormals();
  first.mergeVertices();
  var firstMesh = new THREE.Mesh(first, new THREE.MeshLambertMaterial({
    color: endTubeColor, side: THREE.DoubleSide
  }));

  var second = new THREE.Geometry();
  for (i = 0; i < radiusSegments; i++) {
    var j = i;
    var k = i * 6;

    if (i == radiusSegments - 1) {
      // On the last one, connect the vertices back to the first ones, not to the next
      second.vertices.push(outerTube.vertices[outerTube.vertices.length-2-j+1].clone());
      second.vertices.push(outerTube.vertices[outerTube.vertices.length-1-0+0].clone()); // Back to the first outer vertex
      second.vertices.push(innerTube.vertices[outerTube.vertices.length-2-0+1].clone()); // Back to the first inner vertex
      second.faces.push( new THREE.Face3( k+0, k+1, k+2 ) );

      second.vertices.push(innerTube.vertices[outerTube.vertices.length-2-0+1].clone()); // Back to the first inner vertex
      second.vertices.push(innerTube.vertices[outerTube.vertices.length-2-j+1].clone());
      second.vertices.push(outerTube.vertices[outerTube.vertices.length-2-j+1].clone());
      second.faces.push( new THREE.Face3( k+3, k+4, k+5 ) );
    } else {
      second.vertices.push(outerTube.vertices[outerTube.vertices.length-2-j+0].clone());
      second.vertices.push(outerTube.vertices[outerTube.vertices.length-2-j+1].clone());
      second.vertices.push(innerTube.vertices[outerTube.vertices.length-2-j+0].clone());
      second.faces.push( new THREE.Face3( k+0, k+1, k+2 ) );
      second.vertices.push(innerTube.vertices[outerTube.vertices.length-2-j+0].clone());
      second.vertices.push(innerTube.vertices[outerTube.vertices.length-2-j+1].clone());
      second.vertices.push(outerTube.vertices[outerTube.vertices.length-2-j+1].clone());
      second.faces.push( new THREE.Face3( k+3, k+4, k+5 ) );
    }
  };

  second.computeFaceNormals();
  second.mergeVertices();
  var secondMesh = new THREE.Mesh(second, new THREE.MeshLambertMaterial({
    color: endTubeColor, side: THREE.DoubleSide
  }));

  return {
    outer: outerTubeMesh,
    inner: innerTubeMesh,
    first: firstMesh,
    second: secondMesh
  };
}
