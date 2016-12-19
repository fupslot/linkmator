### OpenGraph

```javascript
const OpenGraph = require('./lib/OpenGraph');
const openGraph = new OpenGraph(<data>);
```

#### Methods

onOpenGraphRequest -

#### Events

##### finish
Occurs when all requests are successfully finished.

##### invalid
Occurs when the Open Graph is invalid. Graph object such as `images` won't be uploaded when this event is fired.

##### ImageResponse
Occurs when all images are successfully loaded.

##### ImageSave
Occurs when all images are successfully saved.
