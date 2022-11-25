// this is a enum wich is used to indicate the
// direction of the arrow or line from the current vector
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

// this is also a enum to give name to some colour
// so that we can remember and use them fluently
// the names are very self exploentory
const colours = {
	block_in_path: '#00FFFF',
	block_tested:  '#A020F0',
	block_default: '#505050',
	none:          '#000000'
}

// this is a class wich will be used to store all the
// information of a cell that we are going to use
// as a grid cell so that we can get and manupulate
// them very easily. the names are very detailed so
// that anyone ca understand
class cell {
	constructor ( pos, anc ) {
		this.pos = new vec2 ( pos.x, pos.y )
		this.block = new Boolean ( false )
		this.arrow = direction.none
		this.start_pos = new Boolean ( false )
		this.end_pos = new Boolean ( false )
		this.visited = new Boolean ( false )
		this.color = colours.block_default
		this.ancestor = new vec2 ( anc.x, anc.y )
	}
}

// here we are storing some global variables to thar all the function can
// access and use them as they need and this is also used to share data
// and infromatin between various functins so that they can get and update
// their latest information the names of the variable is very detailed
// so that its easily understandable
// global variables
const max_allowed_rows = 192
const max_allowed_cols = 108
var current_width, current_height
var cell_width, cell_height
var canvas, context
var grid
var current_start_pos, current_end_pos
var setting_start_pos, setting_end_pos, setting_block

// this function is used to draw path from current processing cell
// of the grid to the starting poisitoin or stating cell
function draw_path ( current ) {
	if ( current == undefined ) return
	context.beginPath ()
	context.strokeStyle = '#FFFFFF'
	my_min = Math.min ( cell_width, cell_height )
	context.lineWidth = my_min / 10;
	// this loops utill the current position is not the
	// starting position and we draw a line from the
	// current position to it's parent node or cell to show
	// a path exist from this cell to it's parent cell
	while ( true ) {
		par = grid[current.x][current.y].ancestor
		context.beginPath ()
		context.moveTo ( grid[par.x][par.y].pos.x+cell_width/2,
			grid[par.x][par.y].pos.y+cell_height/2 )
		context.lineTo ( grid[current.x][current.y].pos.x+cell_width/2,
			grid[current.x][current.y].pos.y+cell_height/2 )
		context.stroke ()
		current = new vec2 ( par.x, par.y )
		// here we cre chacking if the current position is the starting position or not
		// if current position is starting position then we break the loop
		if ( parseInt ( grid[current.x][current.y].ancestor.x ) == parseInt ( current.x )
			&& parseInt ( grid[current.x][current.y].ancestor.y ) == parseInt ( current.y ) ) {
			break
		}
	}
	context.strokeStyle = '#000000'
}

// this function is used to draw the grid that we are used to simulate
// all out algorithm this function also draw the connection between the
// cells  so it's easy to understand and visualize
function draw_grid ( path_srt ) {
	context.clearRect(0, 0, canvas.width, canvas.height)
	my_min = Math.min ( cell_width, cell_height )
	context.beginPath ()
	context.lineWidth = my_min / 10;
	// this two nested loop iterate thorough all the cell
	// or node of the 2d grid to draw them in their connection
	for ( row in grid ) {
		for ( col in grid[row] ) {
			// hrere we are iterating all the 8 neighbour to draw a connection
			// line brween them
			for ( let i = -1 ; i < 2 ; ++i ) {
				for ( let j = -1 ; j < 2 ; ++j ) {
					if ( i == j && i == 0 ) continue
					next = new vec2 ( parseInt(row) + i, parseInt(col) + j )
					if ( inside ( next ) ) {
						context.beginPath ()
						context.strokeStyle = colours.none
						//if ( grid[row][col].visited == Boolean ( true )
						//	&& grid[next.x][next.y].visited == Boolean ( true ) ) {
						//	context.strokeStyle = '#FFFFFF'
						//} else context.strokeStyle = colours.none
						context.moveTo ( grid[row][col].pos.x+cell_width/2,
							grid[row][col].pos.y+cell_height/2 )
						context.lineTo ( grid[next.x][next.y].pos.x+cell_width/2,
							grid[next.x][next.y].pos.y+cell_height/2 )
						context.stroke ()
					}
				}
			}
		}
	}

	// here we are chacking if we need to draw a path to indicationg
	// the current testing node to starting node if we do then we
	// call the draw path function to draw a path
	if ( path_srt != undefined ) {
		draw_path ( path_srt )
	}

//	context.beginPath ()
//	context.strokeStyle = '#000000'
//	for ( row in grid ) {
//		for ( col in grid[row] ) {
//			if ( grid[row][col].arrow != direction.none ) {
//				next = new vec2 ( parseInt(row) + i, parseInt(col) + j )
//				context.moveTo ( grid[row][col].pos.x+cell_width/2,
//					grid[row][col].pos.y+cell_height/2 )
//				context.lineTo ( grid[next.x][next.y].pos.x+cell_width/2,
//					grid[next.x][next.y].pos.y+cell_height/2 )
//			}
//		}
//	}
//	context.stroke ()

	var up_left, cell_pixs = new vec2 ( cell_width/4, cell_height/4 )
	context.beginPath ()
	context.strokeStyle = '#000000'
	// here we are drawing the grid nodes as rectangles
	// just iterating through all the nodes in 2d grid
	// and drawing them in theis associated position
	for ( row in grid ) {
		for ( col in grid[row] ) {
			up_left = new vec2 ( grid[row][col].pos.x, grid[row][col].pos.y )
			up_left.add ( cell_pixs )
			// checking if this node is starting node
			// then draw is in red colour
			if ( grid[row][col].start_pos == true ) {
				context.fillStyle = "#FF0000"
				context.fillRect ( up_left.x, up_left.y, 2*cell_pixs.x, 2*cell_pixs.y )
			// checking if this node i s ending node
			// then drawing it in green color
			} else if ( grid[row][col].end_pos == true ) {
				context.fillStyle = "#00FF00"
				context.fillRect ( up_left.x, up_left.y, 2*cell_pixs.x, 2*cell_pixs.y )
			// if current node is a blocked or current node is wall then
			// draw it in orange color the indicate a wall or block
			} else if ( grid[row][col].block == true ) {
				context.fillStyle = "#FFA500"
				context.fillRect ( up_left.x, up_left.y, 2*cell_pixs.x, 2*cell_pixs.y )
			// otherwise its a normal node so draw it in it's associated colour
			} else {
				context.fillStyle = grid[row][col].color
				context.fillRect ( up_left.x, up_left.y, 2*cell_pixs.x, 2*cell_pixs.y )
			}
			//if ( grid[row][col].arrow != direction.none ) {
			//	draw_line ( grid[row][col].pos, grid[row][col].arrow )
			//}
		}
	}
	context.stroke ()
}

// this function is used to handle the mouse click event
// on the canvas to do the action like
// setting start pos, setting end pos, place block etc
function mouse_clicked ( event ) {
	const rect = canvas.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	var sel_col = parseInt ( Math.floor ( ( x) / cell_width ) )
	var sel_row = parseInt ( Math.floor ( ( y ) / cell_height ) )
	// checking if setting_start_pos variable is true
	// wich can be make true by the buttion given to the user
	// then setting the start pos to the current clicked node/cell
	if ( setting_start_pos == true ) {
		if ( typeof current_start_pos !== "undefined" ) {
			grid[current_start_pos.x][current_start_pos.y].start_pos = false
		}
		current_start_pos = new vec2 ( sel_row, sel_col )
		grid[sel_row][sel_col].start_pos = true
		setting_start_pos = false
	// checking if setting end pos variable is true
	// wich can be make true by the buttion given to the user
	// then setting the end pos to the current clicked node/cell
	} else if ( setting_end_pos == true ) {
		if ( typeof current_end_pos !== "undefined" ) {
			grid[current_end_pos.x][current_end_pos.y].end_pos = false
		}
		current_end_pos = new vec2 ( sel_row, sel_col )
		grid[sel_row][sel_col].end_pos = true
		setting_end_pos = false
	// checking if setting block variable is true
	// wich can be make true by the buttion given to the user
	// then setting a block to the current clicked node/cell
	} else if ( setting_block == true ) {
		grid[sel_row][sel_col].block ^= true
	}
	// then we redraw the grid on the canvas to give a instant
	// interaction fell to the user
	draw_grid ()
}

// this function is called when the page is fully loaded
// on the browser the this function gets the canvas and
// context to the canvas and the hook up a mouse click event
// listener function to the canvas. also the resize_window
// function to resize the canvas to the size of the current
// webpaze size
function init () {
	canvas = document.getElementById("myCanvas")
	context = canvas.getContext("2d")
	canvas.addEventListener ( 'mousedown', mouse_clicked )
	resize_window ()
	draw_grid ()
}

// this function is callbed by pressing the update cell
// button on the html page so the global grid variable can
// be populated with the needed or asked numbers of cell
function update_cell () {
	// we taking the asked number of row and column from the
	// html input box so and convert them to int
	var rows = parseInt ( document.querySelector('input[name="req_rows"]').value )
	var cols = parseInt ( document.querySelector('input[name="req_cols"]').value )
	// checking if the user is asking for a valid
	// row and column size if not then showing an alert to the user
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
	// here we are iterating through all the needed number of rows
	// and needed number of columns to polulate the grid varibale with
	// new nodes and their needed infromations so that we can manupulate
	// and draw them easily
	for ( i = 0 ; i < rows ; ++i ) {
		nxt_row = []
		for ( j = 0 ; j < cols ; ++j ) {
			nxt_row[j] = new cell ( pos, new vec2 ( i, j ) )
			pos.x += cell_width
		}
		grid[i] = nxt_row
		pos.x = 0
		pos.y += cell_height
	}
	draw_grid ()
}

// in this function before statting a simulation
// of an algorithm we check if all the necessary
// information are there to start a simulation
// and if any of the check failed we are not
// starting the simulation and showing an alert
// to the user with the necessary steps to complete
// the steps to start the simulation
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

// this function is used to disable all the buttons and
// inputs so that the can't interrupt the simulation
// wich can do a slowdonw to the browser or even crush
// the browser
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

// this function is used to set the control back to the user
// after a simulation end so that the user can start anotehr
// simulation or resize the grid or etc
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

// this simple fuction used to check if a node exists
// on the grid and if that inside the grid
function inside ( next ) {
	if ( next.x >= 0 && next.x < current_height && next.y >= 0 && next.y < current_width ) {
		return true
	} else {
		return false
	}
}

// this simple function is used to check if the simulation can test this
// grid next. this can be done only this node is not visited already and
// this node is not a blocked node.
function can_go ( next ) {
	if ( next.x >= 0 && next.x < current_height && next.y >= 0 && next.y < current_width ) {
		return (grid[next.x][next.y].visited == Boolean(true)
			|| grid[next.x][next.y].block == Boolean(true) )? false : true
	}
	return false
}
// above two functions are simple but they are used by all the algorithms
// so we make them publickly avaiable to all the functions.

// this function is used to set a parent or direction enum
// to the current node so that the draw function draw a path
// from it to it's ancestor/parent and the draw path function
// can start from this node and go to the starting node
// by simply following the arrow associated with those nodes
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

// this function acts like an franken class like function
// wich is used to store all the necessary storage for a bfs
// simulation and also contain a function inside wich calls
// by the requestAnimationFrame function to a single
// iteration of the BFS algorightm
function generateBFSAnimation () {
	disable_everything ()
	// here creating a queue and populatin it with the starting position
	let q = new queue ()
	q.push ( new vec2 ( current_start_pos.x, current_start_pos.y ) )
	grid[current_start_pos.x][current_start_pos.y].visited = new Boolean ( true )
	// this function is used to do single iteration of the bfs
	function bfs_step ( timestamp ) {
		cp = q.pop()
		// checking if current testing node is aleady the ending posiiong
		// or ending node then stop the simulation
		if ( cp.x == current_end_pos.x && cp.y == current_end_pos.y ) {
			enable_everything ()
			draw_grid ( new vec2 ( cp.x, cp.y ) )
			return new Boolean(true)
		}
		// here checking all the connected node with this node
		// and checking if they needs to be tested then pushing
		// them to the queue in the wrapper function
		for ( i = -1 ; i < 2 ; ++i ) {
			for ( j = -1 ; j < 2 ; ++j ) {
				next = new vec2(cp.x+i, cp.y+j)
				if ( inside ( next ) === true && can_go ( next ) === true ) {
					// now the next node that needs to be tested that goes to
					// the needs testing queue with that nodes all the necessary
					// informatino that one needs.
					grid[next.x][next.y].visited = new Boolean ( true )
					grid[next.x][next.y].ancestor = new vec2 ( cp.x, cp.y )
					grid[next.x][next.y].color = colours.block_tested
					q.push ( new vec2 ( next.x, next.y ) )
					set_arrow ( next, new vec2 ( i, j ) )
				}
			}
		}
		// checking if testing is needed for more nodes
		// ie the queue is not empty already so we call the bfs step function
		// via requestAnimationFrame function to do the next iteration of the algorithm
		if ( q.size > 0 ) {
			draw_grid ( new vec2 ( cp.x, cp.y ) )
			window.requestAnimationFrame ( bfs_step )
		}
		// checking if the queue is empty, if the queue is empty then
		// we did not found a path from starting node to the ending node
		// and stopping the simulation
		if ( q.size < 1 ) {
			enable_everything ()
			draw_grid ( new vec2 ( cp.x, cp.y ) )
			return new Boolean(true)
		}
	}
	// returning the bfs step function so the simulation will be started
	// by calling it via requestAnimationFrame function.
	return bfs_step
}

// this function acts like an franken class like function
// wich is used to store all the necessary storage for a dijkstra
// simulation and also contain a function inside wich calls
// by the requestAnimationFrame function to a single
// iteration of the Dijkstras algorightm
function generateDijkstraAnimation () {
	disable_everything ()
	// here creating a priority queue and populatin it with the starting position
	let pq = new PriorityQueue({
		comparator: function(a, b) { return a.z - b.z; }
	})
	pq.queue ( new vec3 (
		new vec2 ( current_start_pos.x, current_start_pos.y ),
		new vec2 ( 0, 0 ), 0
	))
	// this function is used to do single iteration of the diskstra algorithm
	function dijkstra_step ( timestamp ) {
		// checking if current testing node is aleady the ending posiiong
		// or ending node then stop the simulation
		current = pq.dequeue ()
		cp = current.x
		if ( grid[cp.x][cp.y].visited == Boolean(true) ) {
			window.requestAnimationFrame ( dijkstra_step )
			return
		}
		// now setting the information to the node
		grid[cp.x][cp.y].visited = new Boolean ( true )
		grid[cp.x][cp.y].color = colours.block_tested
		grid[cp.x][cp.y].ancestor = new vec2 ( cp.x - current.y.x, cp.y - current.y.y )
		set_arrow ( cp, current.y )
		if ( cp.x == current_end_pos.x && cp.y == current_end_pos.y ) {
			pq.clear()
			enable_everything ()
			draw_grid ( new vec2 ( cp.x, cp.y ) )
			return
		}
		// here checking all the connected node with this node
		// and checking if they needs to be tested then pushing
		// them to the queue in the wrapper function
		for ( i = -1 ; i < 2 ; ++i ) {
			for ( j = -1 ; j < 2 ; ++j ) {
				if ( i == 0 && j == 0 ) continue
				next = new vec2(cp.x+i, cp.y+j)
				if ( inside ( next )===true && can_go ( next ) === true ) {
					// now the next node that needs to be tested that goes to
					// the needs testing queue with that nodes all the necessary
					// informatino that one needs.
					pq.queue ( new vec3 (
						new vec2 ( next.x, next.y ),
						new vec2 ( i, j ), current.z + 1 )
					)
				}
			}
		}
		// checking if testing is needed for more nodes
		// ie the queue is not empty already so we call the dijkastra step function
		// via requestAnimationFrame function to do the next iteration of the algorithm
		if ( pq.length > 0 ) {
			draw_grid ( new vec2 ( cp.x, cp.y ) )
			window.requestAnimationFrame ( dijkstra_step )
		}
		// checking if the queue is empty, if the queue is empty then
		// we did not found a path from starting node to the ending node
		// and stopping the simulation
		if ( pq.length < 1 ) {
			enable_everything ()
			draw_grid ( new vec2 ( cp.x, cp.y ) )
		}
	}
	// returning the bfs dijkstra step function so the simulation will be started
	// by calling it via requestAnimationFrame function.
	return dijkstra_step
}

// this is a simple class to store the informations of intermediatory
// node infromation used by Astart algorithm
// like the index of the node ant the local distance or value of the
// node also the global heroustincs of the current testing node
class as_node {
	constructor ( index, local, global ) {
		this.index = index
		this.local = local
		this.global = global
	}
}

// this function acts like an franken class like function
// wich is used to store all the necessary storage for a A*
// simulation and also contain a function inside wich calls
// by the requestAnimationFrame function to a single
// iteration of the A* algorightm
function generateAstartAnimation () {
	disable_everything ()
	// making a list to store the next candiate of testing
	let needs_testing = []
	// setting the starting node as a first and onlu candidate
	needs_testing.push (
		new vec4 ( new vec2 ( current_start_pos.x, current_start_pos.y ),
		parseInt ( 0 ),
		current_start_pos.distance ( current_end_pos ),
		new vec2 ( current_start_pos.x, current_start_pos.y ) )
	)
	grid[current_start_pos.x][current_start_pos.y].visited = new Boolean(true);
	// this function just do a single iteration of the astar algorithm
	function astar_step () {
		// as astart needs we are sorting the next candiates to be tested
		// by comparing their local heroustic
		needs_testing.sort ( function ( a, b ) {
			return a.z - b.z
		} )
		let cp = needs_testing.shift ()
		// getting and setting up the best candidate
		// for testing in this iteration
		grid[cp.x.x][cp.x.y].visited = new Boolean(true)
		grid[cp.x.x][cp.x.y].color = colours.block_tested
		grid[cp.x.x][cp.x.y].ancestor = new vec2 ( cp.w.x, cp.w.y )
		if ( cp.x.x == current_end_pos.x && cp.x.y == current_end_pos.y ) {
			enable_everything ()
			draw_grid ( new vec2 ( cp.x.x, cp.x.y ) )
			return new Boolean ( true )
		}
		// checking all the connected nodes and if they can be a candiate
		// the updateing their local and global heroustic and pushing thet
		// to the needs testing list as a candicate
		for ( i = -1 ; i < 2 ; ++i ) {
			for ( j = -1 ; j < 2 ; ++j ) {
				if ( i == 0 && j == 0 ) continue
				next = new vec2(cp.x.x+i, cp.x.y+j)
				if ( inside ( next )===true && can_go ( next ) === true ) {
					needs_testing.push (
						new vec4 (
							new vec2 ( next.x, next.y ),
							parseInt ( cp.y + 1 ),
							next.distance ( current_end_pos ),
							new vec2 ( cp.x.x, cp.x.y )
						)
					)
				}
			}
		}
		// if needs_testing list is empty means we already done all the nodes
		// testing and no testing is left, so no path found and strpping the simulation
		if ( needs_testing.length < 1 ) {
			enable_everything ()
			draw_grid ( new vec2 ( cp.x.x, cp.x.y ) )
			return new Boolean ( true )
		}
		// as tehre is more nodes to be tested so we are going the start the
		// next iteration of the algorthm by calling astar_step via
		// requestAnimationFrame function.
		if ( needs_testing.length > 0 ) {
			draw_grid ( new vec2 ( cp.x.x, cp.x.y ) )
			window.requestAnimationFrame ( astar_step )
		}
	}
	// returning astar_step function to starting the astart
	// simulation by calling it via requestAnimationFrame function
	return astar_step
}

// this function is called when the start simulation button is pressed
// this functin takes the value of the value selected by the dropdown
// algorithm selection and start the simulatin of the algorithm
function start_simulation () {
	// here we are cleaning up the grid so theat previous simulation
	// information can't bias the current algorightm simulation
	for ( row in grid ) {
		for ( col in grid[row] ) {
			grid[row][col].arrow = direction.none
			grid[row][col].visited = new Boolean ( false )
			grid[row][col].color = colours.block_default
			grid[row][col].ancestor = new vec2 ( parseInt(row), parseInt(col) )
		}
	}
	// checking if simulation can be started and then starting the selected simulation
	if ( check_everything () == true ) {
		var algo = document.getElementById ( "algo" ).value
		switch ( algo ) {
			case "bfs":
				window.requestAnimationFrame ( generateBFSAnimation () )
				break;
			case "dijkstra":
				window.requestAnimationFrame ( generateDijkstraAnimation () )
				break;
			case "astar":
				window.requestAnimationFrame ( generateAstartAnimation () )
				break;
		}
	}
}

// this function is called automatically when the
// set start poz button is press so thant now
// the user can click on any node on the grid
// and mark that node a start poz
function start_pos_btn () {
	setting_start_pos = true
	setting_end_pos = false
	setting_block = false
}

// this is same as above start pos function but
// it used to set the ending poz
function end_pos_btn () {
	setting_start_pos = false
	setting_end_pos = true
	setting_block = false
}

// this functin is called whend the blcok button is
// pressed then used can place a block in the grid
// by pressing any of the cell on the grid
function block_btn () {
	setting_start_pos = false
	setting_end_pos = false
	setting_block = true
}

// this function is called autmatically when the window is resized
// this functin gets the new canvas size and resize all the nodes
// othe grid to give the user a interactive feel
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

// hooking up the init function to call automatically call
// when the window is loaded totally and properly
window.onload = init
// hooking up the resize_window function to resize event
// so that that function called automatically when the window is
// resized automatically
window.addEventListener ( 'resize', resize_window )
