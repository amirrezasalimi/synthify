/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("heflrz5ny80by2e")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "njxkkofd",
    "name": "data",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("heflrz5ny80by2e")

  // remove
  collection.schema.removeField("njxkkofd")

  return dao.saveCollection(collection)
})
