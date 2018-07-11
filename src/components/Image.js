import React, {Component} from 'react';

import '../css/Image.css';

class Image extends Component {
	render() {
		return(
			<div className="Image">
				<img className="Image__target" src={this.props.image} />
				<p className="Image__text">Move the cursor over the image, then click and hold to see the zoom</p>
			</div>
		); 
	}
}

export default Image;