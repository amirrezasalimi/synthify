/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p1j0s1cvm0ylddr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s00g7oul",
    "name": "title",
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
  const collection = dao.findCollectionByNameOrId("p1j0s1cvm0ylddr")

  // remove
  collection.schema.removeField("s00g7oul")

  return dao.saveCollection(collection)
})
