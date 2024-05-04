/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9os4tao4aifu931")

  // remove
  collection.schema.removeField("xnnalj35")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ytcqo5tu",
    "name": "project",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "heflrz5ny80by2e",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9os4tao4aifu931")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xnnalj35",
    "name": "task",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "o9ef5oes2vz6dng",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("ytcqo5tu")

  return dao.saveCollection(collection)
})
