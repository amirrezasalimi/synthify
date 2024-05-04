/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yya8tn9ykw3taig")

  // remove
  collection.schema.removeField("xatu3vjp")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yya8tn9ykw3taig")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xatu3vjp",
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
})
