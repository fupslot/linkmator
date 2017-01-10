import React from 'react';

/// material-ui
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

export default function FeedPoster(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(props.graph);
  };

  const handleReset = (event) => {
    event.preventDefault();
    props.onReset(props.graph);
  };

  const paperStyle = {
    margin: 0,
    padding: '1em',
    backgroundColor: '#EEEEEE',
    width: '100%'
  };

  return (
    <Paper style={paperStyle} zDepth={0}>
      <form
        name="feed_poster"
        className="FeedPoster">
        <label className="FeedPoster__title">
          {props.graph.url}
        </label>
        { props.children }
        <div className="FeedPoster__actions">
          <FlatButton
            label="Cancel"
            style={{
              marginRight: '1em'
            }}
            onTouchTap={handleReset} />
          <RaisedButton
            label="Save"
            primary={true}
            onTouchTap={handleSubmit} />
        </div>
      </form>
    </Paper>
  );
}

FeedPoster.propTypes = {
  graph: React.PropTypes.object.isRequired,
  children: React.PropTypes.object.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onReset: React.PropTypes.func.isRequired
};
