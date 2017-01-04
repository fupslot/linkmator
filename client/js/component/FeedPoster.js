import React from 'react';

export default function FeedPoster(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(props.graph);
  };

  const handleReset = (event) => {
    event.preventDefault();
    props.onReset(props.graph);
  };

  return (
    <form
      name="feed_poster"
      className="FeedPoster"
      onSubmit={handleSubmit}
      onReset={handleReset}>
      <div className="FeedPoster__container">
        <label className="FeedPoster__title">
          {props.graph.url}
        </label>
        { props.children }
        <div className="FeedPoster__actions">
          <button type="reset" className="Linkmator__button">Cancel</button>
          <button className="Linkmator__button">Save</button>
        </div>
      </div>
    </form>
  );
}

FeedPoster.propTypes = {
  graph: React.PropTypes.object.isRequired,
  children: React.PropTypes.object.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onReset: React.PropTypes.func.isRequired
};
