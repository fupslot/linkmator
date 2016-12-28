### Route: Feed

#### POST /api/feed

Creates new item in the feed

Request:

```json
{
  "data": {
    "open_graph_id": "<object_id>",
    "type": "PUBLIC"
  }
}
```

Response:

```json
{
  "status": 201,
  "data": {
    "feed_id": "<object_id>"
  }
}
```

##### Type
- PUBLIC - can be visible by other users
- PRIVATE - can't be visible by other users
- SHARED - visibility can be granted
