import React from 'react';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import { MapControl, withLeaflet } from 'react-leaflet';
import { ClassNames } from '@emotion/core';

class LocateMapControl extends MapControl {
  createLeafletElement() {
    return L.control.locate({
      drawCircle: true,
      follow: true,
      keepCurrentZoomLevel: true,
      icon: this.props.className,
      iconLoading: this.props.className,
      showPopup: false,
      position: 'bottomright',
      onLocationError: Function.prototype,
      onLocationOutsideMapBounds: Function.prototype,
    });
  }
}

const LeafletControl = withLeaflet(LocateMapControl);

export default () => (
  <ClassNames>
    {({ css }) => (
      <LeafletControl
        className={css`
          display: block;
          height: 30px;
          background: center 2px no-repeat;
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABqQAAAakBDAYwoQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHMSURBVEiJtZW9alRREMd/sxs1Gq0sAnfuSoS18iOVBARBSCE+QgKCpVZ5AN/AFzAINjaCYiGCdYpUgUACsYlfgd0TghI7NwF3z1g4i8nN3c0x1x0YDszc//zmzOHcg5mR6kC92Wye+RdNjURT1UtZln3sdDp7eZ4/TNUlA0TkDnAZEDO7/98B9Xr9HbALYGavkxvz2Q61RqOhwBUzmwDOich3oNNqtVYqA7Isuysib4CJkvTLEML8MP2xIxKRxwOKA8zleT5dCQBcNLOlkvgygJlNVQWcrdVq68ChWYrIZ1+vVgKIiHnxQwAz2/L8WiWAmcUY4xGAiPQAYozdSgAgiki3CAB6DqoMeAusHgD0fN0zs/fA5jBx0kUDUNV9ABFZNLMFEXnUbrcXj9Ml/ypKLKmzEwP84EcHYNQ78PsxOgCJOxgrBlR1DJgBrgHXfV0u0eaqug58ADbcV0IIOwMBqnobeAFMFYp9PdB1v/Nx4IZ7336p6tMQwkI/UBzRzZLiALeAZ8CTGOMnEXkOTJZ8dwq4p6rj/cCRi6aqs8ADhylw3lP7wGlv6id/34gusAN8AV7x5xH6MRBQNFW9AGQOy7zwtnsAvoUQ4iD9b2no3IQoAzLEAAAAAElFTkSuQmCC');
        `}
      />
    )}
  </ClassNames>
);
