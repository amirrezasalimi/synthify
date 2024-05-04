/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cmcqgdeuxkacqlt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f8xfnaey",
    "name": "usages",
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
  const collection = dao.findCollectionByNameOrId("cmcqgdeuxkacqlt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f8xfnaey",
    "name": "tokens_count",
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
