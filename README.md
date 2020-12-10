# Chatty

The chat interface to rule all chats.

`Uses parcel! ;)`

## Running

```
npm start
```

## Building

```
npm build
```

## Response format from `dagserver`

### `text`

```json
{
  "type": "text",
  "data": "Hello there!"
}
```

### `image`

```json
{
  "type": "image",
  "data": {
    "link": "https://i.imgur.com/NPfzih9.png",
    "title": "Image sample"
  }
}
```

### `table`

```json
{
  "type": "table",
  "data": [{}, {}],
  "title": "Graph title"
}
```

### `graph`

```json
{
  "type": "graph",
  "data": [{}, {}],
  "title": "Graph title",
  "baseName": "<x-graph-label>"
}
```

### `link`

```json
{
  "type": "link",
  "data": {
    "link": "https://github.com/saamaresearch/chatty",
    "text": "Chatty"
  }
}
```

### `pdf`

```json
{
  "type": "link",
  "data": {
    "link": "https://arxiv.org/pdf/1904.10965.pdf",
    "text": "White Paper: time-delay cosmography"
  },
  "linkType": "pdf"
}
```

### `tableau`

```json
{
  "type": "link",
  "data": {
    "link": "https://public.tableau.com/views/Book4_15556982970350/PoppinPyramids?:embed=y&:embed_code_version=3&:loadOrderID=0&:display_count=yes",
    "text": "Tableau report"
  },
  "linkType": "tableau"
}
```
