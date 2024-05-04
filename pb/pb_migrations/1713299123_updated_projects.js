/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("heflrz5ny80by2e")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2kevalgi",
    "name": "json_data",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("heflrz5ny80by2e")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2kevalgi",
    "name": "flows",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
})
