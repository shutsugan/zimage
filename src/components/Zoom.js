import React, {Component} from 'react';

import '../css/Zoom.css';

class Zoom extends Component {
	render() {
		return(
			<div className="Zoom">
				<canvas className="Zoom__canvas"></canvas>
			</div>
		); 
	}
}

export default Zoom;