#!/usr/bin/env node

import app from '../index.js';

const port = 5000;
app.listen(port, () => {
  console.log(`The server has been started on 'localhost:${port}'`);
});