import React from 'react';
import classNames from 'classnames';

const DEFAULT_SIZE = 'small';

const SIZES = {
  'small': { width: '16px', height: '16px'},
  'normal': { width: '24px', height: '24px'}
};

export default function SvgIcon(props) {
  const cx = classNames('SvgIcon', props.className);

  const size = SIZES[props.size] || SIZES[DEFAULT_SIZE];

  return (
    <svg
      className={cx}
      width={size.width}
      height={size.height}>
      <use xlinkHref={`#glyph-${props.glyph}`} />
    </svg>
  );
}

SvgIcon.defaultProps = {
  size: 'small'
};

SvgIcon.propTypes = {
  size: React.PropTypes.string,
  glyph: React.PropTypes.string.isRequired,
  className: React.PropTypes.string
};
