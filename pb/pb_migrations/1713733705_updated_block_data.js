/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9os4tao4aifu931")

  collection.indexes = []

  // remove
  collection.schema.removeField("tvukumaa")

  // remove
  collection.schema.removeField("nsquhm4b")

  // remove
  collection.schema.removeField("9x65k1g9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "azdqaksq",
    "name": "file",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9os4tao4aifu931")

  collection.indexes = [
    "CREATE INDEX `idx_XmCSd6X` ON `block_data` (\n  `block_id`,\n  `task`\n)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tvukumaa",
    "name": "json",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nsquhm4b",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "file",
        "json"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9x65k1g9",
    "name": "block_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "azdqaksq",
    "name": "file",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
