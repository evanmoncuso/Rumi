import React from 'react';
import { connect } from 'react-redux';
import { completeTaskToServer } from '../actions/taskActions';
import { claimTask } from '../actions/claimActions';

// Material things
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

let style = {
  height: 50,
  width: 50,
  margin: 10,
  textAlign: 'center',
  display: 'inline-block',
  overflow: 'hidden'
};

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  completeTask() {
    let taskId = this.props.id;
    this.props.dispatch(completeTaskToServer({taskId}));
  }

  componentDidMount() {
    const ctx = this.refs.canvas.getContext('2d');
    var colors = {
      recent: '#5ED848',
      urgent: '#E39E2E',
      overdue: '#F0401D'
    };

    var fill = colors.recent;
    this.roundRect(ctx, 0, 0, 108, 108, 6, fill);
    const bottomY = 72;
    ctx.clearRect(0, 0, 108, bottomY);
  }
  // helpers for the model
  handleTouchTap(event) {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  claimTask() {
    let taskId = this.props.id;
    console.log(taskId);
    console.log(this.props);
    // this.props.dispatch(claimTaskToServer( {taskId} ));
  }

  render() {

    // let style2 = Object.assign({}, style);
    // if (this.props.color === 0) {
    //   style2.border = '2px solid red';
    // } else if (this.props.color === 1) {
    //   style2.border = '2px solid yellow';
    // } else {
    //   style2.border = '2px solid green';
    // }

    return (
      <div>
        <div className="outerTaskBox" onTouchTap={this.handleTouchTap.bind(this)}>
            <canvas ref="canvas" width={108} height={108} />
            <div className="innerTaskText">
              {this.props.name}
            </div>
        </div>
        <div>
         <Popover
           open={this.state.open}
           anchorEl={this.state.anchorEl}
           anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
           targetOrigin={{horizontal: 'left', vertical: 'top'}}
           onRequestClose={this.handleRequestClose.bind(this)}>
           <Menu>
             <MenuItem
               primaryText="Claim for later"
               onClick={this.claimTask.bind(this)} />
             <MenuItem
               primaryText="Complete"
               onClick={this.completeTask.bind(this)} />
             <MenuItem
               primaryText="edit time due"
               onClick={() => {
                 console.log('edit due time of the task')
               }} />

           </Menu>
         </Popover>
       </div>
      </div>
    );
  }
}

Task = connect()(Task);

export default Task;
