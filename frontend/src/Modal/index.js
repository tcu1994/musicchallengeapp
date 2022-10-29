import React from "react";
import "./modal.css";
import PropTypes from "prop-types";

class Modal extends React.Component {
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="modal" id="modal">
        <h2>Success!</h2>
        <div className="content">{this.props.children}</div>
        <div className="actions">
          <button style={{ color : 'white', border : '1px solid white'}}className="ui button" onClick={this.onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }
}
Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};
export default Modal;