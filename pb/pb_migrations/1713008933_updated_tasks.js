/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o9ef5oes2vz6dng")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "be4lghvz",
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
  const collection = dao.findCollectionByNameOrId("o9ef5oes2vz6dng")

  // remove
  collection.schema.removeField("be4lghvz")

  return dao.saveCollection(collection)
})
