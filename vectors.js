// this is a 2d vector cass wich can store two object
// in x and y object variable and do some 2d vector
// manupulation like scaling translating etc
class vec2 {
	// this constructor make a 2d vector object
	// and gets two object as argument and put them
	// on x and y object variable
	constructor ( x, y ) {
		this.x = x
		this.y = y
	}
	// this method rotate the current vector by the
	// arguemented angle with fixing the argumented
	// fix point not changed of the vector
	rotate ( angle, fix ) {
		angle = angle*(2*Math.PI/360.0)
		let cs = Math.cos ( angle )
		let sn = Math.sin ( angle )
		this.x -= fix.x
		this.y -= fix.y
		let fx = this.x*cs + this.y*sn*(-1)
		let fy = this.x*sn + this.y*cs
		fx += fix.x
		fy += fix.y
		this.x = fx
		this.y = fy
	}
	// this method traslate the current vector
	// by the arguemented pos distance
	translate ( pos ) {
		this.x += pos.x
		this.y += pos.y
	}
	// this method simply do addition of argumented
	// vector with the object vector
	add ( that ) {
		this.x += that.x
		this.y += that.y
	}
	// this method simply do substraction of argumented
	// vector from the object vector
	sub ( that ) {
		this.x -= that.x
		this.y -= that.y
	}
	// this method returns the distance between
	// the arguemented vector and the object vector
	distance ( that ) {
		return Math.sqrt (
			(this.x - that.x) * (this.x - that.x)
			+ (this.y - that.y) * (this.y - that.y)
		)
	}
}

// this is 3d vector wich is similar to the 2d vector
// but all the calcualtions and etc done in 3d space/coordinates
class vec3 {
	constructor ( x, y, z ) {
		this.x = x
		this.y = y
		this.z = z
	}
}

// this is 4d vector wich is similar to the 2d vector
// but all the calcualtions and etc done in 4d space/coordinates
class vec4 {
	constructor ( x, y, z, w ) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
	}
}
