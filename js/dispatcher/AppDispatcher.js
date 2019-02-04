'use strict';

/*
  I've taken this file almost directly from Facebook's examples on github, so I'm leaving their copyright info.
  https://github.com/facebook/flux/tree/master/examples/flux-todomvc/js/dispatcher
*/

/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * AppDispatcher
 *
 * A singleton that operates as the central hub for application updates.
 */

import {Dispatcher} from 'flux';

module.exports = new Dispatcher();
