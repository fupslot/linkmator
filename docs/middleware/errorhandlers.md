### Error Handlers

#### res.sendRequestError(error)

Call when the request can't be processed or contains unexpected data.

Response:
```json
{
  "name": "RequestError",
  "status": 400,
  "errors": [
    {
      "message": "Bad Request - <error message>"
    }
  ]
}
```
