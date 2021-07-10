import React from 'react';

import Box from './Box';

const Container = (props: JSX.IntrinsicAttributes) => (
  <Box maxWidth={1200} {...props} mx="auto" paddingLeft={3} paddingRight={3} />
);

export default Container;
