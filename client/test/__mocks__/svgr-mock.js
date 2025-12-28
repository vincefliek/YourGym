const React = require('react');

const SvgComponent = (props) => {
  return React.createElement('svg', {
    ...props,
    'data-testid': 'svg-mock',
  });
};

module.exports = SvgComponent;
module.exports.ReactComponent = SvgComponent;
