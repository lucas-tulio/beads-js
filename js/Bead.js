var Bead = function (inner, outer, first, second) {

  this.inner = inner;
  this.outer = outer;
  this.first = first;
  this.second = second;
}

Bead.prototype.setPosition = function(x, y, z)  {
  this.inner.position.x = x;
  this.inner.position.y = y;
  this.inner.position.z = z;
  this.outer.position.x = x;
  this.outer.position.y = y;
  this.outer.position.z = z;
  this.first.position.x = x;
  this.first.position.y = y;
  this.first.position.z = z;
  this.second.position.x = x;
  this.second.position.y = y;
  this.second.position.z = z;
}

Bead.prototype.removeFromScene = function(scene) {
  scene.remove(this.inner);
  scene.remove(this.outer);
  scene.remove(this.first);
  scene.remove(this.second);
}

Bead.colors = {
  black: 0x000000,
  red: 0xff0000,
  green: 0x00ff00,
  blue: 0x0000ff,
  yellow: 0xffff00,
  white: 0xffffff
}