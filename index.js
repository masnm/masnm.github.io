class queue {
	constructor() {
		this.elements = {};
		this.head = 0;
		this.tail = 0;
	}
	push ( element ) {
		this.elements[this.tail] = element;
		this.tail++;
	}
	pop () {
		const item = this.elements[this.head];
		delete this.elements[this.head];
		this.head++;
		return item;
	}
	front () {
		return this.elements[this.head];
	}
	get size () {
		return this.tail - this.head;
	}
	get empty () {
		return this.length === 0;
	}
}

const direction = {
	up: 0,
	up_right: 45,
	right: 90,
	right_down: 135,
	down: 180,
	down_left: 225,
	left: 270,
	left_up: 315,
	none: 1000
}

const colours = {
	block_in_path: '#69C46A',
	block_tested:  '#F4A261',
	block_default: '#E76F51'
}

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
	sub ( that ) {
		this.x -= that.x
		this.y -= that.y
	}
}

class vec3 {
	constructor ( x, y, z ) {
		this.x = x
		this.y = y
		this.z = z
	}
}

class cell {
	constructor ( pos ) {
		this.pos = new vec2 ( pos.x, pos.y )
		this.block = new Boolean ( false )
		this.arrow = direction.none
		this.start_pos = new Boolean ( false )
		this.end_pos = new Boolean ( false )
		this.visited = new Boolean ( false )
		this.color = colours.block_default
	}
}

// global variables
const max_allowed_rows = 192
const max_allowed_cols = 108
var current_width, current_height
var cell_width, cell_height
var canvas, context
var grid
var current_start_pos, current_end_pos
var setting_start_pos, setting_end_pos, setting_block

function draw_line ( pos, arrow ) {
	my_min = Math.min ( cell_width, cell_height )
	my_min -= (my_min/6)
	mid_top = new vec2 ( 0, -1 * my_min/2 )
	mid_btm = new vec2 ( 0, my_min/2 )
	lft_leg = new vec2 ( mid_top.x - (my_min/4), mid_top.y + (my_min/4) )
	rht_leg = new vec2 ( mid_top.x + (my_min/4), mid_top.y + (my_min/4) )
	fix_point = new vec2 ( 0, 0 )
	mid_top.rotate ( arrow, fix_point )
	mid_btm.rotate ( arrow, fix_point )
	lft_leg.rotate ( arrow, fix_point )
	rht_leg.rotate ( arrow, fix_point )
	fix_point = new vec2 ( pos.x + cell_width/2, pos.y + cell_height/2 )
	mid_top.translate ( fix_point )
	mid_btm.translate ( fix_point )
	lft_leg.translate ( fix_point )
	rht_leg.translate ( fix_point )
	context.moveTo ( parseInt ( mid_btm.x ), parseInt ( mid_btm.y ) )
	context.lineTo ( parseInt ( mid_top.x ), parseInt ( mid_top.y ) )
	context.moveTo ( parseInt ( lft_leg.x ), parseInt ( lft_leg.y ) )
	context.lineTo ( parseInt ( mid_top.x ), parseInt ( mid_top.y ) )
	context.moveTo ( parseInt ( rht_leg.x ), parseInt ( rht_leg.y ) )
	context.lineTo ( parseInt ( mid_top.x ), parseInt ( mid_top.y ) )
}

function draw_grid () {
	context.clearRect(0, 0, canvas.width, canvas.height)
	context.beginPath ()
	for ( row in grid ) {
		for ( col in grid[row] ) {
			if ( grid[row][col].start_pos == true ) {
				context.fillStyle = "#FF0000"
				context.fillRect ( grid[row][col].pos.x + 1, grid[row][col].pos.y + 1,
					cell_width, cell_height )
			} else if ( grid[row][col].end_pos == true ) {
				context.fillStyle = "#FFFF00"
				context.fillRect ( grid[row][col].pos.x + 1, grid[row][col].pos.y + 1,
					cell_width, cell_height )
			} else if ( grid[row][col].block == true ) {
				context.fillStyle = "#0000FF"
				context.fillRect ( grid[row][col].pos.x + 1, grid[row][col].pos.y + 1,
					cell_width, cell_height )
			} else {
				context.fillStyle = grid[row][col].color
				context.fillRect ( grid[row][col].pos.x + 1, grid[row][col].pos.y + 1,
					cell_width, cell_height )
			}
			if ( grid[row][col].arrow != direction.none ) {
				draw_line ( grid[row][col].pos, grid[row][col].arrow )
			}
		}
	}
	context.stroke ()
}

function mouse_clicked ( event ) {
	const rect = canvas.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	var sel_col = parseInt ( Math.floor ( ( x) / cell_width ) )
	var sel_row = parseInt ( Math.floor ( ( y ) / cell_height ) )
	if ( setting_start_pos == true ) {
		if ( typeof current_start_pos !== "undefined" ) {
			grid[current_start_pos.x][current_start_pos.y].start_pos = false
		}
		current_start_pos = new vec2 ( sel_row, sel_col )
		grid[sel_row][sel_col].start_pos = true
		setting_start_pos = false
	} else if ( setting_end_pos == true ) {
		if ( typeof current_end_pos !== "undefined" ) {
			grid[current_end_pos.x][current_end_pos.y].end_pos = false
		}
		current_end_pos = new vec2 ( sel_row, sel_col )
		grid[sel_row][sel_col].end_pos = true
		setting_end_pos = false
	} else if ( setting_block == true ) {
		grid[sel_row][sel_col].block ^= true
	}
	draw_grid ()
}

function init () {
	canvas = document.getElementById("myCanvas")
	context = canvas.getContext("2d")
	canvas.addEventListener ( 'mousedown', mouse_clicked )
	resize_window ()
	draw_grid ()
}

function update_cell () {
	var rows = parseInt ( document.querySelector('input[name="req_rows"]').value )
	var cols = parseInt ( document.querySelector('input[name="req_cols"]').value )
	if ( rows > max_allowed_rows || cols > max_allowed_cols ) {
		alert ( "Row can be upto " + max_allowed_rows +
			"\nColumn can be upto " + max_allowed_cols
		)
	}
	// TODO: need to NaN check
	if ( rows === Number.NaN || cols === Number.NaN ) {
		alert ( "Row and Columns must be greater than 0" )
	}
	current_width = cols
	current_height = rows
	cell_width = canvas.width / cols
	cell_height = canvas.height / rows
	grid = []
	pos = new vec2 ( 0, 0 )
	for ( i = 0 ; i < rows ; ++i ) {
		nxt_row = []
		for ( j = 0 ; j < cols ; ++j ) {
			nxt_row[j] = new cell ( pos )
			pos.x += cell_width
		}
		grid[i] = nxt_row
		pos.x = 0
		pos.y += cell_height
	}
	draw_grid ()
}

function check_everything () {
	if ( canvas == undefined ) {
		alert ( "Canvas not found" )
		return new Boolean ( false )
	}
	if ( grid == undefined ) {
		alert ( "Please Update Cell first" )
		return new Boolean ( false )
	}
	if ( current_start_pos == undefined ) {
		alert ( "Please set the start pos" )
		return new Boolean ( false )
	}
	if ( current_end_pos == undefined ) {
		alert ( "Please set the end pos" )
		return new Boolean ( false )
	}
	return new Boolean ( true )
}

function disable_everything () {
	document.getElementById ( "updbtn" ).disabled = true
	document.getElementById ( "algo" ).disabled = true
	document.getElementById ( "stsm" ).disabled = true
	document.getElementById ( "rnm" ).disabled = true
	document.getElementById ( "cnm" ).disabled = true
	document.getElementById ( "stps" ).disabled = true
	document.getElementById ( "enps" ).disabled = true
	document.getElementById ( "blbtn" ).disabled = true
}

function enable_everything () {
	document.getElementById ( "updbtn" ).disabled = false
	document.getElementById ( "algo" ).disabled = false
	document.getElementById ( "stsm" ).disabled = false
	document.getElementById ( "rnm" ).disabled = false
	document.getElementById ( "cnm" ).disabled = false
	document.getElementById ( "stps" ).disabled = false
	document.getElementById ( "enps" ).disabled = false
	document.getElementById ( "blbtn" ).disabled = false
}

function inside ( next ) {
	if ( next.x >= 0 && next.x < current_height && next.y >= 0 && next.y < current_width ) {
		return true
	} else {
		return false
	}
}

function can_go ( next ) {
	if ( next.x >= 0 && next.x < current_height && next.y >= 0 && next.y < current_width ) {
		return (grid[next.x][next.y].visited == Boolean(true)
			|| grid[next.x][next.y].block == Boolean(true) )? false : true
	}
	return false
}

function set_arrow ( next, dir ) {
	if ( dir.x == -1 ) {
		if ( dir.y == -1 ) {
			grid[next.x][next.y].arrow = direction.right_down
		} else if ( dir.y == 0 ) {
			grid[next.x][next.y].arrow = direction.down
		} else if ( dir.y == 1 ) {
			grid[next.x][next.y].arrow = direction.down_left
		}
	} else if ( dir.x == 0 ) {
		if ( dir.y == -1 ) {
			grid[next.x][next.y].arrow = direction.right
		} else if ( dir.y == 0 ) {
			grid[next.x][next.y].arrow = direction.none
		} else if ( dir.y == 1 ) {
			grid[next.x][next.y].arrow = direction.left
		}
	} else if ( dir.x == 1 ) {
		if ( dir.y == -1 ) {
			grid[next.x][next.y].arrow = direction.up_right
		} else if ( dir.y == 0 ) {
			grid[next.x][next.y].arrow = direction.up
		} else if ( dir.y == 1 ) {
			grid[next.x][next.y].arrow = direction.left_up
		}
	}
}

function generateBFSAnimation () {
	disable_everything ()
	let q = new queue ()
	q.push ( new vec2 ( current_start_pos.x, current_start_pos.y ) )
	grid[current_start_pos.x][current_start_pos.y].visited = true
	function bfs_step ( timestamp ) {
		cp = q.pop()
		if ( cp.x == current_end_pos.x && cp.y == current_end_pos.y ) {
			while ( q.size > 0 ) {
				q.pop ()
			}
			enable_everything ()
			return
		}
		for ( i = -1 ; i < 2 ; ++i ) {
			for ( j = -1 ; j < 2 ; ++j ) {
				next = new vec2(cp.x+i, cp.y+j)
				if ( inside ( next )===true && can_go ( next ) === true ) {
					grid[next.x][next.y].visited = true
					q.push ( new vec2 ( next.x, next.y ) )
					set_arrow ( next, new vec2 ( i, j ) )
				}
			}
		}
		if ( q.size > 0 ) {
			draw_grid ()
			window.requestAnimationFrame ( bfs_step )
		}
		if ( q.size < 1 ) {
			enable_everything ()
		}
	}
	return bfs_step
}
function generateDijkstraAnimation () {
	disable_everything ()
	let pq = new PriorityQueue({
		comparator: function(a, b) { return a.z - b.z; }
	})
	pq.queue ( new vec3 (
		new vec2 ( current_start_pos.x, current_start_pos.y ),
		new vec2 ( 0, 0 ), 0
	))
	function dijkstra_step ( timestamp ) {
		current = pq.dequeue ()
		cp = current.x
		if ( grid[cp.x][cp.y].visited == Boolean(true) ) {
			window.requestAnimationFrame ( dijkstra_step )
			return
		}
		grid[cp.x][cp.y].visited = true
		set_arrow ( cp, current.y )
		if ( cp.x == current_end_pos.x && cp.y == current_end_pos.y ) {
			pq.clear()
			enable_everything ()
			draw_grid ()
			return
		}
		for ( i = -1 ; i < 2 ; ++i ) {
			for ( j = -1 ; j < 2 ; ++j ) {
				if ( i == 0 && j == 0 ) continue
				next = new vec2(cp.x+i, cp.y+j)
				if ( inside ( next )===true && can_go ( next ) === true ) {
					pq.queue ( new vec3 (
						new vec2 ( next.x, next.y ),
						new vec2 ( i, j ), current.z + 1 )
					)
				}
			}
		}
		if ( pq.length > 0 ) {
			draw_grid ()
			window.requestAnimationFrame ( dijkstra_step )
		}
		if ( pq.length < 1 ) {
			draw_grid ()
			enable_everything ()
		}
	}
	return dijkstra_step
}

function start_simulation () {
	for ( row in grid ) {
		for ( col in grid[row] ) {
			grid[row][col].arrow = direction.none
			grid[row][col].visited = false
		}
	}
	if ( check_everything () == true ) {
		var algo = document.getElementById ( "algo" ).value
		switch ( algo ) {
			case "bfs":
				window.requestAnimationFrame ( generateBFSAnimation () )
				break;
			case "dijkstra":
				window.requestAnimationFrame ( generateDijkstraAnimation () )
				console.log ( algo )
				break;
		}
	}
}

function start_pos_btn () {
	setting_start_pos = true
	setting_end_pos = false
	setting_block = false
}

function end_pos_btn () {
	setting_start_pos = false
	setting_end_pos = true
	setting_block = false
}

function block_btn () {
	setting_start_pos = false
	setting_end_pos = false
	setting_block = true
}

function resize_window ( event ) {
	canvas.width = window.innerWidth * (90/100)
	canvas.height = window.innerHeight * (80/100)
	cell_width = canvas.width / current_width
	cell_height = canvas.height / current_height
	pos = new vec2 ( 0, 0 )
	for ( row in grid ) {
		for ( col in grid[row] ) {
			grid[row][col].pos = new vec2 ( pos.x, pos.y )
			pos.x += cell_width
		}
		pos.x = 0
		pos.y += cell_height
	}
	draw_grid ()
}

window.onload = init
window.addEventListener ( 'resize', resize_window )
