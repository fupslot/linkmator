import React from 'react';
import classNames from 'classnames';

const DEFAULT_SIZE = 'small';

const SIZES = {
  'small': { width: '16px', height: '16px'},
  'regular': { width: '24px', height: '24px'}
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

SvgIcon.propTypes = {
  size: React.PropTypes.string.isRequired,
  glyph: React.PropTypes.string.isRequired,
  className: React.PropTypes.string
};