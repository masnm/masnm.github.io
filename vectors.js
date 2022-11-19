class vec2 {
	constructor ( x, y ) {
		this.x = x
		this.y = y
	}
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
	translate ( pos ) {
		this.x += pos.x
		this.y += pos.y
	}
	add ( that ) {
		this.x += that.x
		this.y += that.y
	}
	sub ( that ) {
		this.x -= that.x
		this.y -= that.y
	}
	distance ( that ) {
		return Math.sqrt (
			(this.x - that.x) * (this.x - that.x)
			+ (this.y - that.y) * (this.y - that.y)
		)
	}
}

class vec3 {
	constructor ( x, y, z ) {
		this.x = x
		this.y = y
		this.z = z
	}
}

class vec4 {
	constructor ( x, y, z, w ) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
	}
}
