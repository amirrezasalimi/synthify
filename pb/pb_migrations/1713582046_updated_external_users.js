/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2rgxt4ou15idv92")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8ucwyx8m",
    "name": "pass_key",
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
  const collection = dao.findCollectionByNameOrId("2rgxt4ou15idv92")

  // remove
  collection.schema.removeField("8ucwyx8m")

  return dao.saveCollection(collection)
})
